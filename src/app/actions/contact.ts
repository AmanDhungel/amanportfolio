"use server";

import { headers } from "next/headers";

import { person } from "@/content/site";

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 2500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/*
 * Best-effort rate limit, per server instance. Serverless instances are
 * short-lived, so this stops bursts rather than a determined attacker; the
 * honeypot and the fill-time check catch most bots before it matters.
 */
const recent = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(key, hits);
    return true;
  }
  hits.push(now);
  recent.set(key, hits);
  return false;
}

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function sendContact(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: field(formData, "name"),
    email: field(formData, "email"),
    message: field(formData, "message"),
  };

  // Bots fill the hidden field or submit instantly. Answer as if it worked.
  const honeypot = field(formData, "company");
  const startedAt = Number(field(formData, "startedAt"));
  if (honeypot || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "success", message: "Thanks. Your message is on its way." };
  }

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!values.name) fieldErrors.name = "Enter your name.";
  else if (values.name.length > 100) fieldErrors.name = "Use 100 characters or fewer.";
  if (!EMAIL_PATTERN.test(values.email) || values.email.length > 200)
    fieldErrors.email = "Enter an email address like name@example.com.";
  if (values.message.length < 10) fieldErrors.message = "Write at least 10 characters.";
  else if (values.message.length > 5000) fieldErrors.message = "Keep it under 5,000 characters.";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Check the highlighted fields.", fieldErrors, values };
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: `Too many messages in a short time. Try again in a few minutes, or email ${person.email}.`,
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      status: "error",
      message: `The form is not set up yet. Email me directly at ${person.email}.`,
      values,
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL ?? person.email],
        reply_to: values.email,
        subject: `Portfolio message from ${values.name}`,
        text: `${values.message}\n\nFrom: ${values.name} <${values.email}>`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Resend responded ${response.status}`);
  } catch (error) {
    console.error("Contact form send failed", error);
    return {
      status: "error",
      message: `Your message could not be sent. Try again, or email ${person.email}.`,
      values,
    };
  }

  return { status: "success", message: "Thanks. Your message is on its way, and I'll reply by email." };
}

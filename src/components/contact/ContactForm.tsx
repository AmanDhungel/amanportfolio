"use client";

import { useActionState, useEffect, useRef } from "react";

import { sendContact, type ContactField, type ContactState } from "@/app/actions/contact";

const initialState: ContactState = { status: "idle" };

const fields: { name: ContactField; label: string; type: "text" | "email" | "textarea"; autoComplete: string }[] = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name" },
  { name: "email", label: "Your email", type: "email", autoComplete: "email" },
  { name: "message", label: "Message", type: "textarea", autoComplete: "off" },
];

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  const startedAt = useRef<HTMLInputElement>(null);
  const openedAt = useRef(0);

  // Stamped on the client, so the server HTML stays static. React resets the
  // form after each submission, so the first stamp is re-applied every time.
  useEffect(() => {
    if (!openedAt.current) openedAt.current = Date.now();
    if (startedAt.current) startedAt.current.value = String(openedAt.current);
  }, [state]);

  const inputClass =
    "mt-2 block w-full rounded-md border border-rule bg-surface px-3.5 py-3 text-ink placeholder:text-muted focus-visible:border-accent aria-[invalid=true]:border-accent";

  return (
    <form action={formAction} noValidate className="grid gap-5" aria-describedby="contact-status">
      {fields.map((item) => {
        const error = state.fieldErrors?.[item.name];
        const errorId = `contact-${item.name}-error`;
        const common = {
          id: `contact-${item.name}`,
          name: item.name,
          autoComplete: item.autoComplete,
          required: true,
          defaultValue: state.status === "error" ? (state.values?.[item.name] ?? "") : "",
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
          className: inputClass,
        };
        return (
          <div key={item.name}>
            <label htmlFor={common.id} className="text-small font-medium">
              {item.label}
            </label>
            {item.type === "textarea" ? (
              <textarea {...common} rows={5} className={`${inputClass} resize-y`} />
            ) : (
              <input {...common} type={item.type} />
            )}
            {error ? (
              <p id={errorId} className="mt-1.5 text-small text-accent">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      {/* Spam traps: a field people never see, and when the form was opened. */}
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </button>
        <p
          id="contact-status"
          role="status"
          aria-live="polite"
          className={`text-small ${state.status === "error" ? "text-accent" : "text-muted"}`}
        >
          {state.message ?? ""}
        </p>
      </div>
    </form>
  );
}

import { ImageResponse } from "next/og";

import { person } from "@/content/site";
import { loadOgFonts } from "@/lib/og-fonts";

export const alt = `${person.name}, full-stack developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0e1622",
          color: "#e3e8ef",
          fontFamily: "Hanken Grotesk",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Newsreader", fontSize: 150, lineHeight: 0.9, letterSpacing: -4 }}>
          <span>{person.firstName}</span>
          <span style={{ fontStyle: "italic", color: "#f0677f" }}>{person.lastName}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 30 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span>Full-stack developer</span>
            <span style={{ color: "#9aa6b5" }}>React, Next.js, Node.js, AWS</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, color: "#9aa6b5" }}>
            <span>{person.location}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 12, color: "#e3e8ef" }}>
              <span style={{ width: 14, height: 14, borderRadius: 999, background: "#5fc495" }} />
              {person.availability}
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}

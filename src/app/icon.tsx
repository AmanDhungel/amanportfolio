import { ImageResponse } from "next/og";

import { loadOgFonts } from "@/lib/og-fonts";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: an italic serif "a" on Prussian ink, with a rhododendron dot. */
export default async function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "#13233a",
        borderRadius: 14,
        color: "#edf0f3",
        fontFamily: "Newsreader",
        fontStyle: "italic",
        fontSize: 54,
        lineHeight: 1,
        paddingBottom: 8,
      }}>
      a
      <span
        style={{
          position: "absolute",
          right: 11,
          bottom: 13,
          width: 9,
          height: 9,
          borderRadius: 999,
          background: "#f0677f",
        }}
      />
    </div>,
    { ...size, fonts: await loadOgFonts() },
  );
}

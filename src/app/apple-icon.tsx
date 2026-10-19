import { ImageResponse } from "next/og";

import { loadOgFonts } from "@/lib/og-fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: an italic serif "a" on Prussian ink, with a rhododendron dot. */
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "#13233a",
          borderRadius: 0,
          color: "#edf0f3",
          fontFamily: "Newsreader",
          fontStyle: "italic",
          fontSize: 150,
          lineHeight: 1,
          paddingBottom: 22,
        }}
      >
        a
        <span style={{ position: "absolute", right: 34, bottom: 38, width: 24, height: 24, borderRadius: 999, background: "#f0677f" }} />
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}

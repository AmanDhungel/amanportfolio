import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontDir = join(process.cwd(), "src/assets/fonts");

/** Cached so the icon and Open Graph routes can be prerendered at build time. */
async function readFontFiles() {
  "use cache";
  return Promise.all(
    ["newsreader-latin-400-normal.woff", "newsreader-latin-400-italic.woff", "hanken-grotesk-latin-500-normal.woff"].map(
      async (file) => new Uint8Array(await readFile(join(fontDir, file))),
    ),
  );
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

/** Fonts for next/og images. ImageResponse needs woff or ttf, not woff2. */
export async function loadOgFonts() {
  const [serif, serifItalic, sans] = (await readFontFiles()).map(toArrayBuffer);
  return [
    { name: "Newsreader", data: serif, style: "normal" as const, weight: 400 as const },
    { name: "Newsreader", data: serifItalic, style: "italic" as const, weight: 400 as const },
    { name: "Hanken Grotesk", data: sans, style: "normal" as const, weight: 500 as const },
  ];
}

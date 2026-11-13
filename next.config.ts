import type { NextConfig } from "next";

import { PRODUCTION_URL } from "./src/lib/site-url";

const nextConfig: NextConfig = {
  // amandhungel.info serves the same deployment; send it to the one address
  // search engines should index, keeping the path.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?amandhungel\\.info" }],
        destination: `${PRODUCTION_URL}/:path*`,
        permanent: true,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'maplehub.co.kr',
          },
        ],
        destination: 'https://www.maplehub.co.kr/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['remotion', '@remotion/player'],

  async redirects() {
    return [
      // www → non-www (permanent 301)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.roomserviceai.com' }],
        destination: 'https://roomserviceai.com/:path*',
        permanent: true,
      },
      // http → https (catches any http://roomserviceai.com hits at the app layer)
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://roomserviceai.com/:path*',
        permanent: true,
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Remotion needs these externals
    config.externals = [
      ...(config.externals || []),
      { canvas: 'canvas' },
    ];

    // Handle Remotion's video codecs
    config.module.rules.push({
      test: /\.mp4$/,
      use: 'file-loader',
    });

    return config;
  },
}

module.exports = nextConfig

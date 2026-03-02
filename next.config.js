/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['remotion', '@remotion/player'],
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

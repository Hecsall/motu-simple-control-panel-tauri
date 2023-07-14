/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Note: This experimental feature is required to use NextJS Image in SSG mode.
  // See https://nextjs.org/docs/messages/export-image-api for different workarounds.
  images: {
    unoptimized: true,
  },
  webpack(config, options) {
    const { options: loaderOptions } = config.module.rules.find(rule => rule.test && rule.test.test('.svg'))
    config.module.rules.push({
      test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
            svgo: false,
          },
        },
      ],
    });

    return config;
  }
}

module.exports = nextConfig
const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { compose } = require('lodash/fp');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const { ANALYZE } = process.env;
const configOption = {
  onDemandEntries: {
    websocketPort: 6602,
    websocketProxyPath: '/hmr',
    websocketProxyPort: 6800,
  },
  generateBuildId: async () => {
    return require('child_process')
      .execSync('git rev-parse HEAD')
      .toString()
      .replace('\n', '');
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  webpack: (config, { isServer }) => {
    if (ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        }),
      );
    }

    //Svg configs
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    //Get rid of warning in css order
    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      }),
    );

    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];

      config.module.rules.push({
        test: antStyles,
        use: 'null-loader',
      });
    }

    return config;
  },
  typescript: {
    ignoreDevErrors: true,
  },
};

module.exports = compose([withSass, withLess, withCSS])(configOption);

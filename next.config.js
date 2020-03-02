const withSass = require("@zeit/next-sass");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { compose } = require("lodash/fp");
const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");

const { ANALYZE } = process.env;
const configOption = {
  onDemandEntries: {
    websocketPort: 6602,
    websocketProxyPath: "/hmr",
    websocketProxyPort: 6800
  },
  generateBuildId: async () => {
    return require("child_process")
      .execSync("git rev-parse HEAD")
      .toString()
      .replace("\n", "");
  },
  webpack: config => {
    if (ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: 8888,
          openAnalyzer: true
        })
      );
    }

    //Svg configs
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    //Get rid of warning in css order
    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
      })
    );

    return config;
  }
};

module.exports = compose([withSass])(configOption);

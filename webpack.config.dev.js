import webpack from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.config.base.js";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export default merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      BA_ENV: `"development"`,
    }),
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
      openAnalyzer: false,
      analyzerMode: "json",
    }),
  ],
});

import webpack from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.config.base.js";

export default merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      BA_ENV: `"production"`,
    })
  ],
});

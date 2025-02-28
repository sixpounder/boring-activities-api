import { createRequire } from "node:module";
import webpack from "webpack";
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import pkg from "./package.json" with { type: "json" };

const require = createRequire(import.meta.url);
const sourcePath = path.resolve("src", "frontend");
const exportPath = path.resolve("dist", "public");
const version = pkg.version ?? "?";

export default {
  devtool: "source-map",
  context: path.resolve(sourcePath),
  entry: "./main.tsx",
  output: {
    path: exportPath,
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].bundle.js",
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        reactScan: {
          test: /[\\/]node_modules[\\/](react-scan)[\\/]/,
          name: "vendor-scan",
          chunks: "all",
        },
        reactVendor: {
          test:
            /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-query)[\\/]/,
          name: "vendor-react",
          chunks: "all",
        },
      },
    },
  },
  devServer: {
    compress: true,
    allowedHosts: "all",
    hot: true,
    host: "localhost",
    port: 3000,
    proxy: [{
      context: ["/api", "/health"],
      target: "http://localhost:8080",
      secure: false,
    }],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: sourcePath,
        loader: require.resolve("babel-loader"),
        options: {
          presets: [
            [
              require.resolve("@babel/preset-flow"),
            ],
            [
              require.resolve("@babel/preset-react"),
              {
                runtime: "automatic",
              },
            ],
          ],
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-inline-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".*", ".js", ".jsx", ".ts", ".tsx", ".css"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(sourcePath, "index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[name].[chunkhash].css",
    }),
    new webpack.DefinePlugin({
      BA_VERSION: `"${version}"`,
    }),
    new CopyPlugin({
      patterns: [
        "public",
      ],
    }),
  ],
};

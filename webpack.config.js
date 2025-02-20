import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const sourcePath = path.resolve("src", "doc");
const exportPath = path.resolve("dist", "public");

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
    splitChunks: {
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
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
      context: ["/api"],
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
          plugins: [
            ["babel-plugin-react-compiler"],
          ],
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
    ],
  },
  resolve: {
    extensions: [".*", ".js", ".jsx", ".ts", ".tsx", ".css"],
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
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
    new CopyPlugin({
      patterns: [
        "public",
      ],
    }),
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
      openAnalyzer: false,
      analyzerMode: "json",
    }),
  ],
};

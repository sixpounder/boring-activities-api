import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const sourcePath = path.resolve("src", "frontend");
const exportPath = path.resolve("dist", "public");
const version = require("./package.json").version ?? "?";

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
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
      openAnalyzer: false,
      analyzerMode: "json",
    }),
  ],
};

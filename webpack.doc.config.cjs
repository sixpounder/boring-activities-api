const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const sourcePath = path.resolve("src", "doc");
const exportPath = path.resolve("dist", "public");

module.exports = {
    devtool: "source-map",
    entry: path.resolve(sourcePath, "main.tsx"),
    output: {
        path: exportPath,
        filename: "app.js"
    },
    devServer: {
        compress: true,
        allowedHosts: 'all',
        hot: true,
        host: "localhost",
        port: 3000,
        proxy: [{
            context: ["/api"],
            target: 'http://localhost:8080',
            secure: false,
        }]
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
                            require.resolve("@babel/preset-flow")
                        ],
                        [
                            require.resolve("@babel/preset-react"),
                            {
                                runtime: "automatic"
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                ],
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.css'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(sourcePath, "index.html")
        }),
        new webpack.HotModuleReplacementPlugin({
            multiStep: true
        })
    ],
}
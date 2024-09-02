const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const joinPath = (pathname) => path.join(__dirname, pathname);

const PATHS = {
    SOURCE_DIR: joinPath("src"),
    BUILD_DIR: joinPath("build"),
};

module.exports = {
    entry: {
        app: PATHS.SOURCE_DIR + "/index.jsx",
    },
    output: {
        path: PATHS.BUILD_DIR,
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]",
                },
            },
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[local]",
                            },
                            importLoaders: 2,
                        },
                    },
                    "sass-loader",
                ],
            },
        ]
    },
    devServer: {
        static: {
            directory: PATHS.BUILD_DIR,
        },
        compress: true,
        port: 4000,
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    watchOptions: {
        ignored: ["node_modules"],
        aggregateTimeout: 500,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: PATHS.SOURCE_DIR + "/index.html",
        }),
    ],
}
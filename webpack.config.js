const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const joinPath = (pathname) => path.join(__dirname, pathname);

const PATHS = {
    SOURCE_DIR: joinPath('examples/src'),
    BUILD_DIR: joinPath('examples/dist'),
};

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    return {
        entry: {
            app: PATHS.SOURCE_DIR + '/index.jsx',
        },
        output: {
            path: PATHS.BUILD_DIR,
            filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
        },
        mode: isProduction ? 'production' : 'development',
        module: {
            rules: [
                {
                    test: /\.jsx?/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/preset-env',
                                    '@babel/preset-react',
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ],
        },
        devServer: {
            static: {
                directory: PATHS.BUILD_DIR,
            },
            compress: true,
            port: 4000,
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        watchOptions: {
            ignored: ['node_modules'],
            aggregateTimeout: 500,
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin(),
            new HtmlWebpackPlugin({
                template: PATHS.SOURCE_DIR + '/index.html',
            }),
        ],
    };
};

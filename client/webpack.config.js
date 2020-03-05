const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const AsyncChunkNames = require('webpack-async-chunk-names-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

const PATH_SOURCE = path.join(__dirname, './src')
const PATH_DIST = path.join(__dirname, './build')

module.exports = {
    mode: 'production',
    target: 'web',
    // webpack will take the files from ./src/index
    entry: [
        path.join(PATH_SOURCE, './index.tsx')
    ],

    // and output it into /dist as bundle.js
    output: {
        path: PATH_DIST,
        filename: '[name].[hash].js',
        publicPath: './',
        chunkFilename: '[name].[hash].js'
    },
    devtool: false,
    // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
    resolve: {
        modules: ['node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.json', '.html']
    },
    module: {
        rules: [
            // we use babel-loader to load our jsx and tsx files
            {
                test: /\.(js|jsx|ts|tsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
            },
            // css-loader to bundle all the css files into one file and style-loader to add all the styles  inside the style tag of the document
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.woff(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.woff2(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
            },
            {
                test: /\.otf(\?.*)?$/,
                loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'
            },
            {
                test: /\.ttf(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?.*)?$/,
                loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]'
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            },
            {
                test: /\.ico$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,

                // vendor chunk
                vendor: {
                    // name of the chunk
                    name: 'vendor',

                    // async + async chunks
                    chunks: 'all',

                    // import file path containing node_modules
                    test: /node_modules/,

                    // priority
                    priority: 20
                },

                // common chunk
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            favicon: path.join(PATH_SOURCE, './favicon.ico'),
            template: path.join(PATH_SOURCE, './index.html'),
            filename: 'index.html',
            inject: 'body',
            chunksSortMode: 'auto'
        }),
        new WebpackPwaManifest({
            name: 'Example',
            short_name: 'ex',
            display: 'standalone',
            theme_color: '#ffffff',
            description: 'desc',
            background_color: '#212121',
            crossorigin: null, //can be null, use-credentials or anonymous
            ios: {
                'apple-mobile-web-app-title': 'Example',
                'apple-mobile-web-app-status-bar-style': 'black'
            },
           /* icons: [
                {
                    src: path.resolve('src/assets/icon/HiRes.png'),
                    size: '1152x1152' // you can also use the specifications pattern
                },
                {
                    src: path.resolve('src/assets/icon/192x192_iPhoneIcon_2.png'),
                    size: '192x192',
                    destination: path.join('icons', 'ios'),
                    ios: true
                },
                {
                    src: path.resolve('src/assets/icon/192x192_iPhoneIcon_2.png'),
                    size: '192x192',
                    destination: path.join('icons', 'android')
                }
            ]*/
        }),
        new AsyncChunkNames(),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify('production')
            }
        })
    ]
};
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const AsyncChunkNames = require('webpack-async-chunk-names-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
module.exports = {
    mode: 'development',
    target: 'web',
    // webpack will take the files from ./src/index
    entry: './src/index.tsx',

    // and output it into /dist as bundle.js
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js',
        publicPath: "/"
    },
    devtool: "source-map",
    // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.html']
    },
    stats: {
        // warnings: false // in dev only -> suppress warnings
    },
    watchOptions: {
        poll: true
    },
    module: {
        rules: [

            // we use babel-loader to load our jsx and tsx files
            {
                test: /\.(ts|js)x?$/,
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
                test: /\.json$/,
                loader: 'json-loader',
                type: 'javascript/auto'
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.(a?png|svg)$/,
                use: 'url-loader?limit=10000'
            },
            {
                test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
                use: 'file-loader'
            },
            {
                test: /\.ico$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },

    // development server configuration
    devServer: {

        // must be `true` for SPAs
        historyApiFallback: true,
        port: 3000
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,

                // vendor chunk
                vendor: {
                    minChunks: 2,
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
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new BundleAnalyzerPlugin(),
        new WebpackPwaManifest({
            name: 'example',
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
            /*icons: [
                {
                    src: path.resolve('src/assets/icon/HiRes.png'),
                    size: '1152x1152' // you can also use the specifications pattern
                },
                {
                    src: path.resolve('src/assets/icon/192x192_iPhoneIcon_1.png'),
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify('development')
            }
        })
    ]
};
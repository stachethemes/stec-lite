const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const I18nLoaderWebpackPlugin = require('@automattic/i18n-loader-webpack-plugin');

/**
 * Ensures that / is used as a path separator in the i18n loader path.
 */
function i18nLoaderRelativePath(from, to) {
    const relativePath = path.relative(from, to);
    return relativePath.replace(/\\/g, '/');
}

module.exports = {
    cache: true,
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: [/node_modules/, /workers/, '/libs/'],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            [
                                "transform-react-jsx", {
                                    "pragma": "wp.element.createElement"
                                }
                            ],
                            ['@babel/plugin-transform-runtime',
                                { "regenerator": true }
                            ],
                            '@automattic/babel-plugin-preserve-i18n'
                        ]
                    }
                }
            },
            {
                test: /\.(png|jpe?g|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext][query]'
                }
            },
            {
                test: /\.(less|css)$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../',
                        }

                    },
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [
        new I18nLoaderWebpackPlugin({
            textdomain: 'stec',
            target: 'plugin',
            path: i18nLoaderRelativePath(__dirname, 'build/assets'),
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/images/dashicon.png", to: path.resolve(__dirname, 'build/assets/images/dashicon.png') },
                { from: "src/images/stachethemes-avatar.jpg", to: path.resolve(__dirname, 'build/assets/images/stachethemes-avatar.jpg') },
                { from: "src/stec.php", to: path.resolve(__dirname, 'build/stec.php') },
                {
                    from: "src/includes",
                    to: path.resolve(__dirname, 'build/includes'),
                    globOptions: {
                        ignore: [
                            '**/.git/**'
                        ]
                    }
                },
                { from: "src/languages", to: path.resolve(__dirname, 'build/languages') },
                { from: "src/js/libs", to: path.resolve(__dirname, 'build/assets/js/libs') },
                { from: "src/js/workers/EventsWorker.js", to: path.resolve(__dirname, 'build/assets/js/workers/events.js') },
            ]
        })
    ],
    output: {
        environment: {
            dynamicImport: false,
        },
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'build/assets'),
        assetModuleFilename: 'images/[name][ext][query]',
        chunkFilename: 'js/[name]-lazy.js?hash=[contenthash]'
    },
    resolve: {
        alias: {
            '@Stec/WebComponents': path.resolve(__dirname, 'src/js/web-components/all.js'),
            '@Stec/CommonComponents': path.resolve(__dirname, 'src/js/common-components'),
            '@Stec/LESS': path.resolve(__dirname, 'src/less'),
            '@Stec/JS': path.resolve(__dirname, 'src/js'),
        }
    },
    externals: {
        '@wordpress/i18n': ['window', 'wp', 'i18n'],
        '@wordpress/moment': ['window', 'moment'],
        '@wordpress/element': ['window', 'wp', 'element'],
        '@wordpress/jp-i18n-loader': ['window', 'wp', 'jpI18nLoader'],
        'lodash': ['window', 'lodash'],
        'react': ['window', 'React'],
        'react-dom': ['window', 'ReactDOM']
    }
}
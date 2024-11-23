const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    mode: 'production',
    optimization: {
        concatenateModules: false,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false
                    },
                    mangle: {
                        reserved: ['__', '_n', '_nx', '_x', 'sprintf', 'lodash', 'moment', 'wp']
                    }
                },
                extractComments: (astNode, comment) => false
            }),
            new CssMinimizerPlugin()
        ],
        usedExports: false // turning on this option causes js errors when two or more entry points are used on the same page
    }
}
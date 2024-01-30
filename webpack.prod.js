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
                    mangle: {
                        reserved: ['__', '_n', '_nx', '_x', 'sprintf', 'lodash', 'moment', 'wp']
                    }
                }
            }),
            new CssMinimizerPlugin()
        ],
        usedExports: 'global'
    }
}
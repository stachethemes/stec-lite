const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const productionConfig = require('./webpack.prod');
const developmentConfig = require('./webpack.dev');
const entries = require('./webpack.entries');
const mode = process.env.NODE_ENV || 'development';

module.exports = () => {
    switch (mode) {
        case 'development':
            return merge(commonConfig, entries, developmentConfig);
        case 'production':
            return merge(commonConfig, entries, productionConfig);
        default:
            throw new Error('Invalid mode value');
    }
}
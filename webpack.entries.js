const path = require('path');

module.exports = {
    entry: {
        'calendar/init': {
            import: path.resolve(__dirname, 'src/js/calendar/init.js'),
        },
        'single-page/init': {
            import: path.resolve(__dirname, 'src/js/pages/single-page/init.js')
        },
        'dashboard/init': {
            import: path.resolve(__dirname, 'src/js/dashboard/init.js')
        },
        'widgets/stec/admin': {
            import: path.resolve(__dirname, 'src/js/widgets/stec/edit/index.js')
        },
        'widgets/events-list/admin': {
            import: path.resolve(__dirname, 'src/js/widgets/events-list/edit/index.js')
        },
        'widgets/events-list/front': {
            import: path.resolve(__dirname, 'src/js/widgets/events-list/front/index.js')
        },
        'widgets/events-slider/admin': {
            import: path.resolve(__dirname, 'src/js/widgets/events-slider/edit/index.js')
        },
        'widgets/events-slider/front': {
            import: path.resolve(__dirname, 'src/js/widgets/events-slider/front/index.js')
        }
    }
}
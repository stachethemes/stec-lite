import { __ } from '@wordpress/i18n';

const defaultKeywords = {
    calendar: [
        'links',
        'modal',
        'popup',
        'single',
        'page',
        'first',
        'day',
        'week',
        'general',
        'date',
        'time',
        'gmt',
        'utc',
        'format',
        'top',
        'menu',
        'filter',
        'filters',
        'inline',
        'categories',
        'category',
        'display',
        'list',
        'check',
        'uncheck',
        'layout',
        'layouts',
        'preview',
        'open',
        'thumbnail',
        'thumbnails',
        'top',
        'today',
        'navigation',
        'search',
        'links',
        'preview',
        'hide',
        'conceal',
        'organizer',
        'organizers',
        'guest',
        'guests',
        'timezone',
        'abbr',
        'abbreviation'
    ],
    layouts: [
        'counter',
        'timer',
        'reverse',
        'order',
        'agenda',
        'slider',
        'list',
        'events',
        'limit',
        'next',
        'month',
        'week',
        'layout',
        'cells',
        'tooltip',
        'title',
        'grid',
        'box',
        'map',
        'aspect',
        'ratio',
        'zoom'
    ],
    comments: [
        'comment',
        'comments',
        'form',
        'type',
        'facebook',
    ],
    fac: [
        'font',
        'fonts',
        'color',
        'colors',
        'theme',
        'themes',
        'style',
        'css',
        'styles',
        'background',
        'customize',
        'custom',
    ],
    dashboard: [
        'dashboard',
        'main',
        'menu',
        'settings',
        'access',
        'manage',
        'wp',
        'media',
        'permissions',
        'permission'
    ],
    lang: [
        'wpml',
        'lang',
        'language',
        'support',
        'multi',
        'lingual',
    ],
    pages: [
        'page',
        'pages',
        'guest',
        'guests',
        'organizers',
        'organizer',
        'slug',
    ],
    misc: [
        'rich',
        'tiny',
        'tinymce',
        'editor',
        'events',
        'fetch',
        'ajax',
        'ai',
        'open',
        'openai',
        'assistant',
        'bot',
        'api',
        'key',
        'data',
        'install',
        'uninstall'
    ]
};

const getKeywords = () => {

    if (typeof window.stecFilterAdminSettingsTabsKeywords === 'undefined') {
        return defaultKeywords;
    }

    return window.stecFilterAdminSettingsTabsKeywords(defaultKeywords);

}

const getKeywordsByTabId = (tabId) => {

    const keywords = getKeywords();

    if (typeof keywords[tabId] === 'undefined') {
        return [];
    }

    return keywords[tabId];

}

const tabsDefaults = [
    {
        id: 'calendar',
        icon: 'fa-solid fa-calendar',
        label: __('Calendar', 'stec'),
        active: true,
        keywords: getKeywordsByTabId('calendar')
    },
    {
        id: 'layouts',
        icon: 'fa-solid fa-table',
        label: __('Layouts', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('layouts')
    },
    {
        id: 'map',
        icon: 'fa-solid fa-map',
        label: __('Map', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('map')
    },
    {
        id: 'comments',
        icon: 'fa-solid fa-comments',
        label: __('Comments', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('comments')
    },
    {
        id: 'fac',
        icon: 'fa-solid fa-paint-brush',
        label: __('Fonts and Colors', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('fac')
    },
    {
        id: 'dashboard',
        icon: 'fa-solid fa-user-cog',
        label: __('Dashboard', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('dashboard')
    },
    {
        id: 'lang',
        icon: 'fa-solid fa-language',
        label: __('Language', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('lang')
    },
    {
        id: 'pages',
        icon: 'fa-solid fa-wrench',
        label: __('Pages', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('pages')
    },
    {
        id: 'misc',
        icon: 'fa-solid fa-ellipsis',
        label: __('Misc', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('misc')
    }
]

export default tabsDefaults;
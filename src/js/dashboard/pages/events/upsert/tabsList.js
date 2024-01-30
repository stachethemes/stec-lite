import { __ } from '@wordpress/i18n';

const defaultKeywords = {
    general: [
        'general',
        'title',
        'slug',
        'calendar',
        'calendars',
        'select',
        'color',
        'event',
        'thumb',
        'thumbail',
        'thumbails',
        'image',
        'icon',
        'timezone',
        'start',
        'end',
        'date',
        'repeat',
        'rrule',
        'all',
        'day',
        'category',
        'categories',
        'status',
        'featured',
        'comments',
        'allow',
        'read',
        'edit',
        'permission',
        'permissions',
        'hide',
        'add',
        'new'
    ],
    introduction: [
        'new',
        'add',
        'remove',
        'intro',
        'introduction',
        'image',
        'images',
        'slider',
        'media',
        'description',
        'text',
        'about',
        'short',
        'external',
        'link',
        'read',
        'more'
    ],
    schedule: [
        'new',
        'add',
        'remove',
        'schedule',
        'timetable',
        'timetables',
        'list',
        'timespan',
        'timespans',
        'time',
        'span'
    ],
    location: [
        'new',
        'add',
        'remove',
        'location',
        'virtual',
        'venue',
        'address',
        'map',
        'latitude',
        'longitude',
        'coordinates',
        'country',
        'city',
        'zip',
        'code',
        'state',
        'province',
        'street',
        'place'
    ],
    organizers: [
        'add',
        'remove',
        'organizer',
        'organizers',
        'host',
        'hosts',
        'author',
        'authors'
    ],
    guests: [
        'add',
        'remove',
        'guest',
        'guests',
        'speakers',
        'speaker',
        'performers',
        'performer',
        'artists',
        'artist',
        'instructors',
        'instructor',
        'teachers',
        'teacher',
        'presenters',
        'presenter'
    ],
    attachments: [
        'attachment',
        'attachments',
        'file',
        'files',
        'download',
        'downloads'
    ],
    'public-health': [
        'public',
        'health',
        'covid',
        'corona',
        'virus',
        'pandemic',
        'social',
        'distance',
        'mask',
        'masks',
        'vaccination',
        'vaccinations',
        'vaccinated',
        'vaccine',
        'vaccines',
        'require',
        'required',
        'requirement'
    ],
    about: [
        'about',
        'author',
        'authors',
        'change',
        'details',
        'edit'
    ]
};

const getKeywords = () => {

    if (typeof window.stecFilterAdminEventTabsKeywords === 'undefined') {
        return defaultKeywords;
    }

    return window.stecFilterAdminEventTabsKeywords(defaultKeywords);

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
        id: 'general',
        icon: 'fa-solid fa-cog',
        label: __('General', 'stec'),
        active: true,
        keywords: getKeywordsByTabId('general')
    },
    {
        id: 'introduction',
        icon: 'fa-solid fa-paragraph',
        label: __('Introduction', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('introduction')
    },
    {
        id: 'schedule',
        icon: 'fa-solid fa-list',
        label: __('Schedule', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('schedule')
    },
    {
        id: 'location',
        icon: 'fa-solid fa-map-marker-alt',
        label: __('Location', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('location')
            
    },
    {
        id: 'organizers',
        icon: 'fa-solid fa-user-edit',
        label: __('Organizers', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('organizers')
    },
    {
        id: 'guests',
        icon: 'fa-solid fa-star',
        label: __('Guests', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('guests')
    },
    {
        id: 'attachments',
        icon: 'fa-solid fa-file-download',
        label: __('Attachments', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('attachments')
    },
    {
        id: 'public-health',
        icon: 'fa-solid fa-shield-virus',
        label: __('Public health', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('public-health')
    },
    {
        id: 'about',
        icon: 'fa-solid fa-address-card',
        label: __('About', 'stec'),
        active: false,
        keywords: getKeywordsByTabId('about')
    }
]

export default tabsDefaults;
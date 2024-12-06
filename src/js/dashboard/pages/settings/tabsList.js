import { __ } from '@wordpress/i18n';
import { getTabKeywords } from './filterMap';

const tabsDefaults = [
    {
        id: 'calendar',
        icon: 'fa-solid fa-calendar',
        label: __('Calendar', 'stachethemes_event_calendar_lite'),
        active: true,
        keywords: getTabKeywords('calendar')
    },
    {
        id: 'layouts',
        icon: 'fa-solid fa-table',
        label: __('Layouts', 'stachethemes_event_calendar_lite'),
        active: false,
        keywords: getTabKeywords('layouts')
    },
    {
        id: 'map',
        icon: 'fa-solid fa-map',
        label: __('Map', 'stachethemes_event_calendar_lite'),
        active: false,
        keywords: getTabKeywords('map')
    },
    {
        id: 'comments',
        icon: 'fa-solid fa-comments',
        label: __('Comments', 'stachethemes_event_calendar_lite'),
        active: false,
        keywords: getTabKeywords('comments')
    },
    {
        id: 'fac',
        icon: 'fa-solid fa-paint-brush',
        label: __('Fonts and Colors', 'stachethemes_event_calendar_lite'),
        active: false,
        keywords: getTabKeywords('fac')
    },
    {
        id: 'dashboard',
        icon: 'fa-solid fa-user-cog',
        label: __('Dashboard', 'stachethemes_event_calendar_lite'),
        active: false,
        keywords: getTabKeywords('dashboard')
    },
    {
        id: 'language',
        icon: 'fa-solid fa-language',
        label: __('Language', 'stachethemes_event_calendar_lite'),
        active: false,
        keywords: getTabKeywords('language')
    },
    {
        id: 'pages',
        icon: 'fa-solid fa-wrench',
        label: __('Pages', 'stachethemes_event_calendar_lite'),
        active: false,
        keywords: getTabKeywords('pages')
    },
    {
        id: 'misc',
        icon: 'fa-solid fa-ellipsis',
        label: __('Misc', 'stachethemes_event_calendar_lite'),
        active: false,
        keywords: getTabKeywords('misc')
    }
]

export default tabsDefaults;
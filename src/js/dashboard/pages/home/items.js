import { __ } from '@wordpress/i18n';

const all = [
    {
        id: 'settings',
        label: __('Settings', 'stachethemes_event_calendar_lite'),
        icon: 'fa-solid fa-cog',
        buttons: [
            {
                id: 'settings',
                className: 'blue',
                icon: 'fa-solid fa-wrench',
                label: __('Manage', 'stachethemes_event_calendar_lite')
            },
        ]
    },
    {
        id: 'calendars',
        label: __('Calendars', 'stachethemes_event_calendar_lite'),
        icon: 'fa-solid fa-calendar-alt',
        buttons: [
            {
                id: 'calendars-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'calendars-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stachethemes_event_calendar_lite')
            },
        ]
    },
    {
        id: 'events',
        label: __('Events', 'stachethemes_event_calendar_lite'),
        icon: 'fa-solid fa-calendar-day',
        buttons: [
            {
                id: 'events-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'events-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stachethemes_event_calendar_lite')
            },
        ]
    },
    {
        id: 'categories',
        label: __('Categories', 'stachethemes_event_calendar_lite'),
        icon: 'fa-solid fa-folder',
        buttons: [
            {
                id: 'categories-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'categories-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stachethemes_event_calendar_lite')
            },
        ]
    },
    {
        id: 'organizers',
        label: __('Organizers', 'stachethemes_event_calendar_lite'),
        icon: 'fa-solid fa-user-edit',
        buttons: [
            {
                id: 'organizers-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'organizers-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stachethemes_event_calendar_lite')
            },
        ]
    },
    {
        id: 'guests',
        label: __('Guests', 'stachethemes_event_calendar_lite'),
        icon: 'fa-solid fa-star',
        buttons: [
            {
                id: 'guests-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'guests-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stachethemes_event_calendar_lite')
            },
        ]
    },
    {
        id: 'locations',
        label: __('Locations', 'stachethemes_event_calendar_lite'),
        icon: 'fa-solid fa-map-marker-alt',
        buttons: [
            {
                id: 'locations-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stachethemes_event_calendar_lite')
            },
            {
                id: 'locations-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stachethemes_event_calendar_lite')
            },
        ]
    },
    {
        id: 'upgrade',
        label: __('Upgrade', 'stachethemes_event_calendar_lite'),
        icon: 'fa-regular fa-circle-up',
        buttons: [
            {
                id: 'upgrade-get',
                icon: 'fa-solid fa-shopping-cart',
                className: 'green',
                label: __('Get full version', 'stachethemes_event_calendar_lite'),
                href: 'https://codecanyon.net/item/stachethemes-event-calendar-wordpress-events-calendar-plugin/16168229?ref=Stachethemes'
            },
            {
                id: 'upgrade-compare',
                icon: 'fa-solid fa-scale-unbalanced-flip',
                className: 'blue',
                label: __('Compare', 'stachethemes_event_calendar_lite')
            },
        ]
    }
];

const items = all.filter(item => {

    switch (item.id) {

        case 'upgrade':
        case 'settings': {
            return STEC_VARIABLES?.current_user?.capability?.manage_settings ? true : false;
        }

        case 'categories':
        case 'guests':
        case 'organizers':
        case 'locations':
        case 'calendars': {
            return STEC_VARIABLES?.current_user?.capability?.[`manage_${item.id}`] ? true : false;
        }

        case 'events': {
            return STEC_VARIABLES?.current_user?.capability?.manage_events ? true : false;
        }

    }

    return true;

});


export default items;
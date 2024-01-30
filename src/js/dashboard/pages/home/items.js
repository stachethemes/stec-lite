import { __ } from '@wordpress/i18n';

const all = [
    {
        id: 'settings',
        label: __('Settings', 'stec'),
        icon: 'fa-solid fa-cog',
        buttons: [
            {
                id: 'settings',
                className: 'blue',
                icon: 'fa-solid fa-wrench',
                label: __('Manage', 'stec')
            },
        ]
    },
    {
        id: 'calendars',
        label: __('Calendars', 'stec'),
        icon: 'fa-solid fa-calendar-alt',
        buttons: [
            {
                id: 'calendars-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stec')
            },
            {
                id: 'calendars-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stec')
            },
        ]
    },
    {
        id: 'events',
        label: __('Events', 'stec'),
        icon: 'fa-solid fa-calendar-day',
        buttons: [
            {
                id: 'events-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stec')
            },
            {
                id: 'events-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stec')
            },
        ]
    },
    {
        id: 'categories',
        label: __('Categories', 'stec'),
        icon: 'fa-solid fa-folder',
        buttons: [
            {
                id: 'categories-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stec')
            },
            {
                id: 'categories-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stec')
            },
        ]
    },
    {
        id: 'organizers',
        label: __('Organizers', 'stec'),
        icon: 'fa-solid fa-user-edit',
        buttons: [
            {
                id: 'organizers-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stec')
            },
            {
                id: 'organizers-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stec')
            },
        ]
    },
    {
        id: 'guests',
        label: __('Guests', 'stec'),
        icon: 'fa-solid fa-star',
        buttons: [
            {
                id: 'guests-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stec')
            },
            {
                id: 'guests-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stec')
            },
        ]
    },
    {
        id: 'locations',
        label: __('Locations', 'stec'),
        icon: 'fa-solid fa-map-marker-alt',
        buttons: [
            {
                id: 'locations-upsert',
                icon: 'fa-solid fa-plus',
                className: 'green',
                label: __('Add new', 'stec')
            },
            {
                id: 'locations-list',
                className: 'blue',
                icon: 'fa-solid fa-list',
                label: __('Manage', 'stec')
            },
        ]
    },
    {
        id: 'upgrade',
        label: __('Upgrade', 'stec'),
        icon: 'fa-regular fa-circle-up',
        buttons: [
            {
                id: 'upgrade-get',
                icon: 'fa-solid fa-shopping-cart',
                className: 'green',
                label: __('Get full version', 'stec'),
                href: 'https://codecanyon.net/item/stachethemes-event-calendar-wordpress-events-calendar-plugin/16168229?ref=Stachethemes'
            },
            {
                id: 'upgrade-compare',
                icon: 'fa-solid fa-scale-unbalanced-flip',
                className: 'blue',
                label: __('Compare', 'stec')
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
            return STEC_VARIABLES?.current_user?.capability?.manage_terms ? true : false;
        }

        case 'events': {
            return STEC_VARIABLES?.current_user?.capability?.manage_events ? true : false;
        }

    }

    return true;

});


export default items;
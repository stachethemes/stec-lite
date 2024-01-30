const attributes = {
    title: {
        type: 'string',
        default: 'Events List'
    },
    stec_cal: {
        type: 'array',
        default: []
    },
    stec_cat: {
        type: 'array',
        default: []
    },
    stec_loc: {
        type: 'array',
        default: []
    },
    stec_org: {
        type: 'array',
        default: []
    },
    author: {
        type: 'string',
        default: ''
    },
    min_date: {
        type: 'string',
        default: 'start_of_this_month',
    },
    min_date_custom: {
        type: 'string',
        default: ''
    },
    max_date: {
        type: 'string',
        default: 'end_of_this_month'
    },
    max_date_custom: {
        type: 'string',
        default: ''
    },
    limit: {
        type: 'integer',
        default: 5
    },
    order: {
        enum: ['desc', 'asc'],
        default: 'desc'
    },
    event_status: {
        type: 'array',
        default: ['EventScheduled', 'EventMovedOnline', 'EventRescheduled']
    },
    display_tags: {
        type: 'boolean',
        default: true
    },
    display_thumbnail: {
        type: 'boolean',
        default: true
    },
    display_categories: {
        type: 'boolean',
        default: true
    },
    display_locations: {
        type: 'boolean',
        default: true
    },
    display_tickets: {
        type: 'boolean',
        default: true
    },
    display_description: {
        type: 'boolean',
        default: true
    },
    featured_only: {
        type: 'boolean',
        default: false
    },
    open_events_in: {
        enum: ['_self', '_blank'],
        default: '_self'
    },
    prefer_external_link: {
        type: 'boolean',
        default: false
    },
    extra: {
        type: 'string',
        default: ''
    },
    events_prefetch: {
        type: 'boolean',
        default: false
    }
}

export default attributes;
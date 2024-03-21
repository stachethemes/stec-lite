const attributes = {
    calendar__layout: {
        type: 'string',
        default: 'agenda',
    },
    calendar__layouts: {
        type: 'array',
        default: ['agenda','week','month','day','grid','boxgrid','map'],
    },
    filter__featured: {
        type: 'boolean',
        default: false
    },
    filter__calendar: {
        type: 'string',
        default: ''
    },
    filter__category: {
        type: 'string',
        default: ''
    },
    filter__organizer: {
        type: 'string',
        default: ''
    },
    filter__location: {
        type: 'string',
        default: ''
    },
    filter__guest: {
        type: 'string',
        default: ''
    },
    filter__min_date: {
        type: 'string',
        default: ''
    },
    filter__min_date_custom: {
        type: 'string',
        default: ''
    },
    filter__max_date: {
        type: 'string',
        default: ''
    },
    filter__max_date_custom: {
        type: 'string',
        default: ''
    },
    filter__start_date: {
        type: 'string',
        default: ''
    },
    filter__minmax_intersect: {
        type: 'boolean',
        default: false
    },
    filter__author: {
        type: 'string',
        default: ''
    },
    filter__read_permission: {
        type: 'string',
        default: ''
    },
    filter__min_allowed_year: {
        type: 'string',
        default: ''
    },
    filter__max_allowed_year: {
        type: 'string',
        default: ''
    },
    extra: {
        type: 'string',
        default: ''
    }
}

export default attributes;
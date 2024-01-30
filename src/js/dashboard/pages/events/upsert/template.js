const dateNowString = moment().format('YYYY-MM-DD\\THH:mm');

/**
 * Initial state of the event form
 * Can be overidden by global STEC_EVENT_TEMPLATE variable if exists 
 */

const template = typeof window.STEC_EVENT_TEMPLATE !== 'undefined' ? window.STEC_EVENT_TEMPLATE : {
    title: {
        raw: ''
    },
    slug: '',
    content: {
        raw: ''
    },
    excerpt: {
        raw: ''
    },
    status: 'publish',
    comment_status: 'closed',
    stec_cal: '',
    stec_cat: '',
    stec_gst: '',
    stec_loc: '',
    stec_org: '',
    meta: {
        color: '#464646',
        thumbnail: {
            type: 'icon',
            icon: 'fa-solid fa-calendar-day',
            image: []
        },
        timezone: 'stec_cal_default',
        schedule: [],
        images: [],
        attendance_method: '',
        attendance_persons_per_rsvp: -1,
        attendance_rsvp_schedule_start: -1,
        attendance_rsvp_schedule_end: -1,
        attendance_persons_limit: -1,
        attendance_private_list: false,
        attachments: [],
        external_link: {
            url: '',
            text: ''
        },
        event_status: 'EventScheduled',
        featured: false,
        start_date: dateNowString,
        end_date: dateNowString,
        all_day: false,
        hide_end: false,
        rrule: '',
        manual_rrule: false,
        exdate: [],
        products: [],
        tickets: [],
        health_measures: {
            require_masks: false,
            require_temp: false,
            require_distance: false,
            require_tracing: false,
            require_rapid_test: false,
            require_pcr_test: false,
            require_certificate: false,
            custom: ''
        },
        author_notes: '',
        read_permission: ['stec_public'],
        edit_permission: ['stec_private'],
    }
};

export default template
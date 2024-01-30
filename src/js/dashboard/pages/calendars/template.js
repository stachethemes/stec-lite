import timezonesList from '@Stec/JS/timezones-list';

const getDefaultTimezone = () => {

    const tzListValues = timezonesList.map(tz => {
        return tz.value;
    });

    if (typeof STEC_VARIABLES !== 'undefined' && tzListValues.includes(STEC_VARIABLES.wptz)) {
        return STEC_VARIABLES.wptz;
    }

    return 'UTC';

}

const templateTimezone = getDefaultTimezone();

/**
 * Initial state of the calendar form
 * Can be overidden by global STEC_CALENDAR_TEMPLATE variable if exists 
 */
const template = typeof window.STEC_CALENDAR_TEMPLATE !== 'undefined' ? window.STEC_CALENDAR_TEMPLATE : {
    name: '',
    slug: '',
    status: 'publish',
    meta: {
        author: '', // Author is auto populated from the class.rest-stec_cal-controller.php
        require_event_approval: true,
        color: '#f15e6e',
        thumbnail: {
            type: 'icon',
            icon: 'fa-solid fa-calendar',
            image: []
        },
        timezone: templateTimezone,
        read_permission: ['stec_public'],
        use_permission: ['stec_private'],
        edit_permission: ['stec_private'],
    }
};

export default template
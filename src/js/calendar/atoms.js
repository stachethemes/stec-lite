import { atom, selector } from 'recoil';

/**
 * Settings atts list
 */
export const settingsAttsList = atom({
    key: 'settingsAttsList',
    default: {
        // taxonomy filters
        filter__organizer: '',
        filter__location: '',
        filter__guest: '',
        filter__category: '',
        filter__calendar: '',
        filter__min_date: '',
        filter__max_date: '',
        filter__start_date: '',
        filter__featured: '',
        filter__events: '',
        filter__read_permission: '',
        filter__author: '',

        calendar__dow: 0,
        calendar__date_format: 'stec_dmy',
        calendar__time_format: 'stec_24',
        calendar__show_tz_offset: false,
        calendar__top_enabled: true,
        calendar__top_today_button: true,
        calendar__top_nav_buttons: true,
        calendar__top_datepicker_menu: true,
        calendar__top_search_menu: true,
        calendar__top_filters_menu: 1, /* 0 = disabled, 1 = dropdown, 2 = static */
        calendar__top_layouts_menu: true,
        calendar__top_inline_categories: false,
        calendar__top_categories_start_inactive: false,
        calendar__layouts: 'agenda,month,week,day,grid,boxgrid,map',
        calendar__layout: 'agenda',
        calendar__open_events_in: 'calendar',
        calendar__links_target: '_self',

        layouts__agenda_list_reverse_order: false,
        layouts__agenda_list: true,
        layouts__agenda_list_limit: 4,
        layouts__agenda_list_more_button: true,
        layouts__agenda_list_next_button: true,
        layouts__agenda_slider: true,
        layouts__grid_image_auto_height: false,
        layouts__grid_gutter: 10,
        layouts__grid_columns: 4,
        layouts__grid_limit: 4,
        layouts__grid_more_button: true,
        layouts__grid_next_button: true,
        layouts__grid_reverse_order: false,
        layouts__grid_counter: true,
        layouts__boxgrid_gutter: 0,
        layouts__boxgrid_columns: 4,
        layouts__boxgrid_limit: 4,
        layouts__boxgrid_more_button: true,
        layouts__boxgrid_next_button: true,
        layouts__boxgrid_reverse_order: false,
        layouts__month_week_image_auto_height: false,
        layouts__month_week_force_title: false,
        layouts__month_week_style: 'fixed',
        layouts__month_week_quick_open: true,
        layouts__map_zoom: 10,

        map__type: 'osm',
        map__gmap_api_key: '',

        comments__type: 'internal',

        dashboard__in_calendar: true,

        misc__address_order: 'country,state,city,address,postal_code',
        misc__min_allowed_year: 2020,
        misc__max_allowed_year: 2035,
        misc__tiny_mce_enabled: true,
        misc__tiny_mce_api_key: '',
        misc__events_per_request: 100

    }
});

/**
 * Settings atts getter/setter
 */
export const settingsAtts = selector({
    key: 'settingsAtts',
    get: ({ get }) => {
        const value = get(settingsAttsList);
        return value;
    },

    set: ({ set, get }, newValue) => {
        const currentValues = get(settingsAttsList);
        set(settingsAttsList, { ...currentValues, ...newValue });
    }
});

/**
 * Active calendar layout
 * Possible values: agenda, month, week, day, grid, boxgrid, map
 */
export const calendarLayout = atom({
    key: 'calendarLayout',
    default: 'month'
});

/**
 * Active calendar date
 */
export const calendarDate = atom({
    key: 'calendarDate',
    default: {
        year: moment().year(),
        month: moment().month(),
        date: moment().date(),
    }
});

/**
 * Getter/Setter for calendarDate 
 * Expects moment object
 * @returns moment object
 */
export const calendarMoment = selector({

    key: 'calendarMoment',

    get: ({ get }) => {

        const value = get(calendarDate);

        const momentDate = moment().set({
            year: value.year,
            month: value.month,
            date: value.date
        });

        return momentDate;
    },

    set: ({ get, set }, newMomentValue) => {

        const settingsAtts = get(settingsAttsList);
        const minAllowedYear = settingsAtts.misc__min_allowed_year;
        const maxAllowedYear = settingsAtts.misc__max_allowed_year;

        const minAllowedMoment = moment().set({
            year: minAllowedYear,
            month: 0,
            date: 1,
            hours: 0,
            minutes: 0,
            seconds: 0
        });

        const maxAllowedMoment = moment().set({
            year: maxAllowedYear,
            month: 11,
            date: 31,
            hours: 23,
            minutes: 59,
            seconds: 59
        });

        if (newMomentValue.isAfter(maxAllowedMoment, 'day')) {
            newMomentValue = moment(minAllowedMoment);
        } else if (newMomentValue.isBefore(minAllowedMoment, 'day')) {
            newMomentValue = moment(maxAllowedMoment)
        }

        const dateObject = {
            year: newMomentValue.year(),
            month: newMomentValue.month(),
            date: newMomentValue.date(),
        }

        set(calendarDate, dateObject);

    }
});

/**
 * Events list
 * Contains the calendar events
 */
export const calendarEvents = atom({
    key: 'calendarEvents',
    default: {
        items: [],
        ready: false,
        error: false
    }
});

/**
 * Calendar top filters
 */
export const calendarTopFilters = atom({
    key: 'calendarTopFilters',
    default: {
        items: [],
        ready: false,
        error: false
    }
});

/**
 * Media screen type 
 * Possible values: mobile, tablet, '' (desktop)
 */
export const calendarScreenType = atom({
    key: 'calendarScreenType',
    default: ''
});

/**
 * Used to refresh the agenda slider component on demand
 */
export const agendaSliderKey = atom({
    key: 'agendaSliderKey',
    default: 0
});

/**
 * The event layout structure
 */
export const eventStructure = atom({
    key: 'eventStructure',
    default: {}
});

/**
 * Show/hide dashbard changes notice state
 */
export const dashboardChangesNotice = atom({
    key: 'dashboardChangesNotice',
    default: true
});
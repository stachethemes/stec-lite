import Thumbnail from '@Stec/CommonComponents/Thumbnail';
import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cloneDeep } from 'lodash';

export const getMediaSizes = () => {

    if (typeof window.stecFilterMediaSizes === 'function') {
        return window.stecFilterMediaSizes();
    }

    return {
        'mobile': 660,
        'tablet': 1050
    }

}

export const getTzAbbr = (momentObject, {
    timezone = 'UTC',
    userTime = false
}) => {
    const tzAbbr = userTime ? Intl.DateTimeFormat().resolvedOptions().timeZone : timezone;
    return momentObject.tz(tzAbbr).format('z');
}

export const getPluginUrl = (path) => {

    const pluginUrl = new URL(STEC_VARIABLES.plugin_url);

    if (path) {
        pluginUrl.pathname += path;
    }

    return pluginUrl;

}

export const getImageUrl = (imageName) => {

    const imagePath = new URL(`${STEC_VARIABLES.plugin_url}assets/images/${imageName}`);

    return imagePath;

}

export const isMobile = () => {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

export const getRegexByType = (type) => {

    switch (type) {

        case 'title': {
            return /\S+/
        }

        case 'slug': {
            // i am afraid i have to allow non-latin characters in slugs for now
            // allow empty string to /\S+/

            return /\S*/ // /^[a-za-z0-9]+(?:-[a-za-z0-9]+)*$|^$/;
        }

        case 'email': {
            // email regex. allow empty string
            return /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        }

        case 'required_email': {
            // email regex. do not allow empty string
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        }

        case 'end_date':
        case 'start_date': {
            return /[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2})?/;
        }

        case 'coordinates': {
            return /^[-]?\d{1,2}(\.\d+)?,\s*[-]?\d{1,3}(\.\d+)?$/;
        }

        case 'text': {
            return /[\w\u00C0-\u017F]/;
        }

        case 'phone': {
            return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        }

        default:
            return null;
    }

}

export const onResizeEnd = (callback, wait = 100) => {

    const debounce = (func) => {
        let timer;
        return (event) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, wait, event);
        };
    }

    window.addEventListener("resize", debounce(function (e) {
        if ('function' === typeof callback) {
            callback();
        }
    }));

}

export const MediaFrame = (args) => {

    return new Promise((resolve) => {
        const mediaFrame = window.wp.media({
            button: { text: args.buttonText },
            library: { type: args.libraryType },
            frame: 'select',
            title: args.title,
            multiple: args.multiple
        });

        mediaFrame.open();

        mediaFrame.on('select', () => {
            const attachments = mediaFrame.state().get('selection').toJSON();
            return resolve(attachments);
        });

    });

};

export const centerScrollElement = (scrollWrapperRef, activeElementRef) => {
    const activeElementOffsetY = activeElementRef.current.offsetTop;
    const activeElementHeight = activeElementRef.current.clientHeight / 2;
    const wrapperHeight = scrollWrapperRef.current.clientHeight / 2;
    scrollWrapperRef.current.scrollTo({ top: activeElementOffsetY - wrapperHeight - activeElementHeight });
}

export const getDayLabels = (type = '') => {

    const dayLabels = [
        __('Sunday', 'stec'),
        __('Monday', 'stec'),
        __('Tuesday', 'stec'),
        __('Wednesday', 'stec'),
        __('Thursday', 'stec'),
        __('Friday', 'stec'),
        __('Saturday', 'stec'),
    ];

    if ('short' === type) {
        return dayLabels.map((dayLabel) => {
            return dayLabel.substring(0, 3);
        });
    }

    return dayLabels;
}

export const getMonthLabels = (type = '') => {

    const monthLabels = [
        __('January', 'stec'),
        __('February', 'stec'),
        __('March', 'stec'),
        __('April', 'stec'),
        __('May', 'stec'),
        __('June', 'stec'),
        __('July', 'stec'),
        __('August', 'stec'),
        __('September', 'stec'),
        __('October', 'stec'),
        __('November', 'stec'),
        __('December', 'stec')
    ];

    if (type === 'short') {
        return monthLabels.map((monthLabel) => {
            return monthLabel.substring(0, 3);
        });
    }

    return monthLabels;

}

export const getMonthLabel = (monthNum, type = '') => {

    const monthLabels = [
        __('January', 'stec'),
        __('February', 'stec'),
        __('March', 'stec'),
        __('April', 'stec'),
        __('May', 'stec'),
        __('June', 'stec'),
        __('July', 'stec'),
        __('August', 'stec'),
        __('September', 'stec'),
        __('October', 'stec'),
        __('November', 'stec'),
        __('December', 'stec')
    ];

    const monthLabel = monthLabels[parseInt(monthNum, 10)];

    if ('short' === type) {
        return monthLabel.substring(0, 3);
    }

    return monthLabel;

}

export const getTimeFormat = () => {

    const timeFormat = STEC_VARIABLES.time_format;
    let tf;

    switch (timeFormat) {
        case 'stec_24':
            tf = 'HH:mm';
            break;
        case 'stec_12':
            tf = 'hh:mm a';
            break;
        case 'wp':
            tf = getWpDateformat('time');
            break;
        default:
            tf = timeFormat ? timeFormat : getWpDateformat('time');
    }

    return tf;
}

export const beautifyEventTimespan = ({
    event,
    dateFormat = STEC_VARIABLES.date_format,
    timeFormat = STEC_VARIABLES.time_format,
    showUtcOffset = false,
    fullMonth = false,
    forceHideEnd = false,
    showInUserTimezone = false,
    print = false // whether the date is for print mode
}) => {

    const startMoment = moment.tz(event.meta.start_date, event.meta.timezone);
    const endMoment = moment.tz(event.meta.end_date, event.meta.timezone);
    const hideEnd = forceHideEnd || event.meta.hide_end;
    const returnDate = [];
    const monthLabel = fullMonth ? 'MMMM' : 'MMM';
    let allDay = event.meta.all_day;
    let df, tf; // date format, time format

    if (showInUserTimezone) {

        startMoment.local();
        endMoment.local();

        if (allDay && startMoment.hour() > 0) {

            allDay = false;

            if (endMoment.minute() === 59) {
                endMoment.add(1, 'minute'); // round up
            }

        }
    }

    switch (dateFormat) {
        case 'stec_dmy':
            df = `D ${monthLabel}, YYYY`;
            break;
        case 'stec_mdy':
            df = `${monthLabel} D, YYYY`;
            break;
        case 'stec_ymd':
            df = `YYYY, ${monthLabel} D`;
            break;
        case 'wp':
            df = getWpDateformat('date');
            break;
        default:
            df = dateFormat ? dateFormat : getWpDateformat('date');
    }

    switch (timeFormat) {
        case 'stec_24':
            tf = 'HH:mm';
            break;
        case 'stec_12':
            tf = 'hh:mm a';
            break;
        case 'wp':
            tf = getWpDateformat('time');
            break;
        default:
            tf = timeFormat ? timeFormat : getWpDateformat('time');
    }

    returnDate.push(startMoment.format(df));

    if (!allDay) {
        returnDate.push(startMoment.format(tf));
    }

    if (!hideEnd) {

        const isSameDay = endMoment.isSame(startMoment, 'day');

        if (!isSameDay || !allDay) {
            returnDate.push(' - ');
        }
        if (!isSameDay) {
            returnDate.push(endMoment.format(df));
        }
        if (!allDay) {
            returnDate.push(endMoment.format(tf));
        }
    }

    if (showUtcOffset) {

        const displayedTimezone = getTzAbbr(startMoment, {
            userTime: showInUserTimezone,
            timezone: event.meta.timezone
        });

        returnDate.push(`(${displayedTimezone})`);
    }

    let returnDateString = returnDate.join(' ');

    if (typeof window.stecFilterBeautifyEventTimespan === 'function') {

        returnDateString = window.stecFilterBeautifyEventTimespan({
            event,
            dateFormat,
            timeFormat,
            showUtcOffset,
            fullMonth,
            forceHideEnd,
            showInUserTimezone,
            print
        }, returnDateString);
    }

    return returnDateString;
}

/**
 * Format date into a user-friendly string representation.
 * @param {string} date - The date to format.
 * @param {boolean} allDay - Whether the event is an all-day event.
 * @param {string} dateFormat - The date format string (optional).
 * @param {string} timeFormat - The time format string (optional).
 * @return {string} - The formatted date string.
 */
export const beautifyDate = (
    date,
    allDay,
    dateFormat = STEC_VARIABLES.date_format,
    timeFormat = STEC_VARIABLES.time_format
) => {

    // Use Moment.js to validate the input date
    const validDate = moment(date);
    if (!validDate.isValid()) {
        return '';
    }

    // Define object literals for date and time formats
    const df = {
        'stec_dmy': 'D MMMM, YYYY',
        'stec_mdy': 'MMMM D, YYYY',
        'stec_ymd': 'YYYY, MMMM D',
        'wp': getWpDateformat('date')
    }[dateFormat] || getWpDateformat('date');

    const tf = {
        'stec_24': 'HH:mm',
        'stec_12': 'hh:mm a',
        'wp': getWpDateformat('time')
    }[timeFormat] || STEC_VARIABLES.time_format;

    // Define the format string based on the allDay boolean value
    const format = allDay ? df : `${df} ${tf}`;

    let returnDateString = validDate.format(format);

    if (typeof window.stecFilterBeautifyDate === 'function') {

        returnDateString = window.stecFilterBeautifyDate({
            date,
            allDay,
            dateFormat,
            timeFormat
        }, returnDateString);

    }

    return returnDateString;

}

export const getCellColor = (event, thumbnailSource = 'event') => {

    let color = event.meta.color;

    switch (thumbnailSource) {

        case 'calendar': {

            if (event.calendar) {
                color = event.calendar.color;
            }

            break;

        }

        case 'category': {

            if (Array.isArray(event.categories) && event.categories[0]) {
                color = event.categories[0].color;
            }

            break;

        }

        case 'organizer': {

            if (Array.isArray(event.organizers) && event.organizers[0]) {
                color = event.organizers[0].color;
            }

            break;
        }

    }

    return color;
}

export const getEventThumbnailByType = (event, size = '', thumbnailSource = 'event') => {

    const getThumbnailComponent = (thumbnailType, thumbnailData, backgroundColor) => {
        switch (thumbnailType) {
            case 'image': {

                const image = thumbnailData?.image[0]?.sizes?.thumbnail;

                return (
                    <Thumbnail
                        type='image'
                        image={image}
                        backgroundColor={backgroundColor}
                        size={size}
                    />
                );
            }


            case 'date': {
                const eventStartMoment = moment.utc(event.meta.start_date);
                const date = eventStartMoment.date();
                const monthNum = eventStartMoment.month();
                const monthLabel = getMonthLabel(monthNum, 'short');

                return (
                    <Thumbnail
                        type='date'
                        day={date}
                        month={monthLabel}
                        backgroundColor={backgroundColor}
                        size={size}
                    />
                );
            }

            case 'icon':
            default:
                return (
                    <Thumbnail
                        type='icon'
                        icon={thumbnailData.icon}
                        backgroundColor={backgroundColor}
                        size={size}
                    />
                );
        }
    };

    if (thumbnailSource === 'calendar' && event.calendar) {
        const calendar = event.calendar;
        const { thumbnail, color } = calendar;
        return getThumbnailComponent(thumbnail.type, thumbnail, color);
    }

    if (thumbnailSource === 'category' && Array.isArray(event.categories) && event.categories[0]) {
        const category = event.categories[0];
        const { thumbnail, color } = category;
        return getThumbnailComponent(thumbnail.type, thumbnail, color);
    }

    if (thumbnailSource === 'organizer' && Array.isArray(event.organizers) && event.organizers[0]) {
        const organizer = event.organizers[0];
        let type = 'icon';
        let thumbnail = '';
        let color = organizer.color;

        if (organizer.photo && organizer.photo.id) {
            thumbnail = {
                image: [
                    organizer.photo
                ]
            }

            type = 'image';
        }

        return getThumbnailComponent(type, thumbnail, color);
    }

    return getThumbnailComponent(event.meta.thumbnail.type, event.meta.thumbnail, event.meta.color);

}

export const getColorBrightness = (hex) => {
    const [r, g, b] = hex.substring(1) // strip #
        .match(/.{2}/g) // split the string into 2-character chunks
        .map((chunk) => parseInt(chunk, 16)); // convert each chunk to decimal

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma;
};

export const getIsEventScheduled = (event) => {
    return !['EventCancelled', 'EventPostponed'].includes(event.meta.event_status);
}

export const eventHasHealthMeasures = (event) => {

    if (!event.meta.health_measures) {
        return false;
    }

    if (event.meta.health_measures.custom && event.meta.health_measures.custom !== '') {
        return true;
    }

    return Object.values(event.meta.health_measures).some(value => value === true);
}

export const getEventMapMarkerIcon = (event, thumbnailSource = 'event') => {

    const StecDivContainer = document.createElement('stec-div');
    let theThumbnail = getEventThumbnailByType(event, '', thumbnailSource);
    createRoot(StecDivContainer).render(theThumbnail);
    return StecDivContainer;

}

export const getGmapOverlayIcon = (event, thumbnailSource = 'event') => {

    function gmapOverlay(event) {
        this.thumbnailSource = thumbnailSource;
        this.event = event;
        this.eventListeners = [];
    }

    gmapOverlay.prototype = new google.maps.OverlayView();

    gmapOverlay.prototype.addListener = function (listener, fn) {
        this.eventListeners.push({
            event: listener,
            fn: fn
        });
    }

    gmapOverlay.prototype.onAdd = function () {
        this.StecDiv = getEventMapMarkerIcon(this.event, this.thumbnailSource);
        this.StecDiv.className = 'stec-gmap-overlay-pin';
        this.StecDiv.style = 'position: absolute';

        const panes = this.getPanes();

        if (!panes) {
            return;
        }

        const domElement = panes.overlayMouseTarget.appendChild(this.StecDiv);

        this.eventListeners.forEach((eventListener) => {
            domElement.addEventListener(eventListener.event, function (e) {
                if (typeof eventListener.fn === 'function') {
                    eventListener.fn(e);
                }
            });
        });

    }

    gmapOverlay.prototype.draw = function () {
        const overlayProjection = this.getProjection();

        if (!overlayProjection) {
            return;
        }

        const coordinates = event.location.coordinates.split(',');
        const lat = Number(coordinates[0]);
        const lng = Number(coordinates[1]);
        const pos = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(lat, lng));
        const StecDiv = this.StecDiv;
        StecDiv.style.left = (pos.x - 28) + 'px';
        StecDiv.style.top = (pos.y - 57) + 'px';
    }

    gmapOverlay.prototype.onRemove = function () {

        if (!this.StecDiv) {
            return;
        }

        this.StecDiv.parentNode.removeChild(this.StecDiv);
        this.StecDiv = null;
    };

    const overlay = new gmapOverlay(event);

    return overlay;
}

export const getGoogleCalImportLink = (event) => {

    const d1 = moment.tz(event.meta.start_date, event.meta.timezone);
    const d2 = moment.tz(event.meta.end_date, event.meta.timezone);

    let startDate, endDate;

    if (event.all_day) {
        startDate = d1.format('YYYYMMDD');
        endDate = moment(d2).add(1, 'day').format('YYYYMMDD');
    } else {
        startDate = d1.utc().format('YYYYMMDDTHHmmss') + 'Z';
        endDate = d2.utc().format('YYYYMMDDTHHmmss') + 'Z'
    }

    const location = event.location ?
        [
            event.location.postal_code,
            event.location.address,
            event.location.city,
            event.location.state,
            event.location.country
        ].filter(Boolean).join(', ') :
        '';

    const description = event.short_description;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event.title}&dates=${startDate}/${endDate}&details=${description}&location=${location}&sf=true&output=xml`;

}

export const getEventSortedImages = (event) => {

    if (event.meta.images.length <= 0) {
        return [];
    }

    const clonedImages = cloneDeep(event.meta.images);

    clonedImages.sort(({ order: a }, { order: b }) => a - b);

    return clonedImages;

}

export const canModerateCalendar = (calendarId) => {

    try {

        if (true === STEC_VARIABLES?.current_user?.capability?.super) {
            return true;
        }

        if (Array.isArray(STEC_VARIABLES?.current_user?.capability?.moderate?.stec_cal)) {

            if (STEC_VARIABLES.current_user.capability.moderate.stec_cal.includes(calendarId)) {
                return true;
            }

        }

        return false;

    } catch (e) {

        return false;
    }

}

export const getWpDateformat = (dateOrTime = false) => {

    let format = [];

    switch (dateOrTime) {

        case 'date': {
            format = [STEC_VARIABLES.wpdate_format];

            break;
        }

        case 'time': {
            format = [STEC_VARIABLES.wptime_format];

            break;
        }

        default: {
            format = [STEC_VARIABLES.wpdate_format, STEC_VARIABLES.wptime_format]
        }
    }

    format = format.join(' ');

    const list = {
        'A': 'A',      // for the sake of escaping below
        'a': 'a',      // for the sake of escaping below
        'B': '',       // Swatch internet time (.beats), no equivalent
        'c': 'YYYY-MM-DD[T]HH:mm:ssZ', // ISO 8601
        'D': 'ddd',
        'd': 'DD',
        'e': 'zz',     // deprecated since version 1.6.0 of moment.js
        'F': 'MMMM',
        'G': 'H',
        'g': 'h',
        'H': 'HH',
        'h': 'hh',
        'I': '',       // Daylight Saving Time? => moment().isDST();
        'i': 'mm',
        'j': 'D',
        'L': '',       // Leap year? => moment().isLeapYear();
        'l': 'dddd',
        'M': 'MMM',
        'm': 'MM',
        'N': 'E',
        'n': 'M',
        'O': 'ZZ',
        'o': 'YYYY',
        'P': 'Z',
        'r': 'ddd, DD MMM YYYY HH:mm:ss ZZ', // RFC 2822
        'S': 'o',
        's': 'ss',
        'T': 'z',      // deprecated since version 1.6.0 of moment.js
        't': '',       // days in the month => moment().daysInMonth();
        'U': 'X',
        'u': 'SSSSSS', // microseconds
        'v': 'SSS',    // milliseconds (from PHP 7.0.0)
        'W': 'W',      // for the sake of escaping below
        'w': 'e',
        'Y': 'YYYY',
        'y': 'YY',
        'Z': '',       // time zone offset in minutes => moment().zone();
        'z': 'DDD',
    }

    let phpFormatArray = format.split('');

    phpFormatArray = phpFormatArray.map(replace => {

        if (list[replace]) {
            return list[replace];
        }

        return replace;

    });

    return phpFormatArray.join('');

}

export const htmlEntities = (str) => {

    if (typeof str !== 'string') {
        return str;
    }

    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (m) => {
        switch (m) {
            case '&amp;':
                return '&';
            case '&lt;':
                return '<';
            case '&gt;':
                return '>';
            case '&quot;':
                return '"';
            case '&#039;':
                return "'";
        }
    });

}

export const getEventPermalink = (event) => {

    let eventPermalink = event.permalink;

    if (event.repeat_offset && event.repeat_offset > 0) {

        if (eventPermalink.slice(-1) !== '/') {
            eventPermalink += '/';
        }

        eventPermalink += `${event.meta.start_date}`
    }

    return eventPermalink;

}

export const sortEventsByFeatured = (events) => {

    if (!events || !events.length) {
        return events;
    }

    const featuredEvents = events.filter(event => event.meta.featured === true);
    const nonFeaturedEvents = events.filter(event => event.meta.featured !== true);

    featuredEvents.sort((a, b) => {
        return moment.utc(a.meta.start_date_utc).diff(moment.utc(b.meta.start_date_utc));
    });

    return [...featuredEvents, ...nonFeaturedEvents];

}

/**
 * Get the first day of the month in the calendar view.
 * @param {moment|string} activeDate 
 * @returns {moment} - The first day of the month in the calendar view. Moment is in user timezone.
 */
export const getFirstDayOfMonthInView = (activeDate, firstDayOfWeek) => {

    const activeDateString = typeof activeDate === 'string' ? activeDate : activeDate.format('YYYY-MM-DD');
    const firstDayOfMonth = moment.utc(activeDateString).startOf('month');
    const diff = (firstDayOfMonth.day() - firstDayOfWeek + 7) % 7;
    const firstDayInView = moment.utc(firstDayOfMonth).subtract(diff, 'days');
    const dateString = firstDayInView.format('YYYY-MM-DD');

    return moment(dateString).startOf('day');
}

/**
 * Get the first day of the week in the calendar view.
 * @param {moment|string} activeDate 
 * @returns {moment} - The first day of the week in the calendar view. Moment is in user timezone.
 */
export const getFirstDayOfWeekInView = (activeDate, firstDayOfWeek) => {

    const activeDateString = typeof activeDate === 'string' ? activeDate : activeDate.format('YYYY-MM-DD');
    const firstDay = moment.utc(activeDateString).startOf('day');
    const diff = (firstDay.day() - firstDayOfWeek + 7) % 7;
    const firstDayInView = moment.utc(firstDay).subtract(diff, 'days');
    const dateString = firstDayInView.format('YYYY-MM-DD');

    return moment(dateString).startOf('day');
}

export const getEventMomentWithOffset = (dateString, offset, eventTimezone) => {
    const offsetDateString = moment.utc(dateString).add(offset, 'seconds').format('YYYY-MM-DD HH:mm:ss');
    const eventMomentDate = moment.tz(offsetDateString, eventTimezone);
    return eventMomentDate;
}
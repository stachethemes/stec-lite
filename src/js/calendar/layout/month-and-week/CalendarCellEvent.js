import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getCellColor, getColorBrightness, isMobile, getEventPermalink } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useRef, useState } from 'react';
import EventTooltip from './EventTooltip';

const CalendarCellEventRelative = (props) => {

    const openEventIn = useSettingsAtt('calendar__open_events_in');
    const linksTarget = useSettingsAtt('calendar__links_target');
    const quickOpen = useSettingsAtt('layouts__month_week_quick_open');
    const thumbnailSource = useSettingsAtt('calendar__thumbnail_source');
    const cellColor = getCellColor(props.event, thumbnailSource);
    const eventStartMomentRelative = moment.utc(props.event.meta.start_date);
    const eventCellStartMomentRelative = moment.utc(props.event.meta.start_date);
    const eventCellEndMomentRelative = moment.utc(props.event.meta.end_date);
    const eventColorBrightnesss = getColorBrightness(cellColor);
    const classNameArray = ['stec-calendar-cell-event'];
    const cellTitleClassNameArray = ['stec-calendar-cell-event-title'];
    const isEventCancelled = props.event.meta.event_status === 'EventCancelled';
    const tooltipEventRef = useRef(0);
    const [showTooltip, setShowTooltip] = useState(false);
    const isMobileDevice = isMobile();

    const eventTitle = isEventCancelled ? <del>{props.event.title}</del> : props.event.title;

    let cellTitle = props.forceTitle ? eventTitle : '';

    if (eventCellStartMomentRelative.format('YMD') === props.cellMoment.format('YMD')) {
        classNameArray.push('stec-calendar-cell-event-is-start')
        cellTitle = eventTitle;
    }

    if (eventCellEndMomentRelative.format('YMD') === props.cellMoment.format('YMD')) {
        classNameArray.push('stec-calendar-cell-event-is-end')
    }

    if (eventStartMomentRelative.format('YMD') < moment().format('YMD')) {
        classNameArray.push('stec-calendar-cell-event-is-expired');
    }

    if (eventColorBrightnesss > 170) {
        classNameArray.push('stec-calendar-cell-event-bright-background');
        cellTitleClassNameArray.push('stec-calendar-cell-event-title-dark');
    }

    if (true === showTooltip) {
        classNameArray.push('stec-calendar-cell-event-has-tooltip');
    }

    return (
        <StecDiv
            className={classNameArray.join(' ')} style={{
                backgroundColor: cellColor,
                marginTop: 22 * props.eventMarginTop
            }}

            onClick={(e) => {

                if (quickOpen) {

                    e.stopPropagation();

                    switch (openEventIn) {

                        case 'external': {

                            let openLink = props.event.meta?.external_link?.url;

                            if (!openLink) {
                                openLink = getEventPermalink(props.event);
                            }

                            window.open(openLink, linksTarget);

                            break;

                        }

                        case 'single': {

                            const openLink = getEventPermalink(props.event);

                            window.open(openLink, linksTarget);

                            break;
                        }

                        default: {

                            const cellDateKey = props.cellMoment.format('YYYY-MM-DD');
                            const eventId = props.event.id;
                            const eventStartDate = props.event.meta.start_date;
                            const activeEventKey = `${cellDateKey}--${eventId}--${eventStartDate}`;

                            props.setActiveEventKey(activeEventKey);
                        }

                    }
                }
            }}

            onMouseOver={() => {
                if (!isMobileDevice) {
                    setShowTooltip(true);
                }
            }}

            onMouseOut={() => {
                if (!isMobileDevice) {
                    setShowTooltip(false);
                }
            }}

            ref={tooltipEventRef}>

            {showTooltip && <EventTooltip event={props.event} />}

            <StecSpan className={cellTitleClassNameArray.join(' ')}>
                {1 !== props.event.meta.approved && <i className='stec-calendar-cell-event-pending fa-regular fa-hourglass' />}
                {(props.event.meta.featured && cellTitle) && <i className='stec-calendar-cell-event-featured fa-solid fa-star' />}
                {cellTitle}
            </StecSpan>

        </StecDiv>
    )

}

const CalendarCellEventLocal = (props) => {

    const openEventIn = useSettingsAtt('calendar__open_events_in');
    const linksTarget = useSettingsAtt('calendar__links_target');
    const quickOpen = useSettingsAtt('layouts__month_week_quick_open');
    const thumbnailSource = useSettingsAtt('calendar__thumbnail_source');
    const cellColor = getCellColor(props.event, thumbnailSource);
    const eventStartMomentLocal = moment.tz(props.event.meta.start_date, props.event.meta.timezone).local();
    const eventCellStartMomentLocal = moment.utc(props.event.meta.start_date_utc).local();
    const eventCellEndMomentLocal = moment.utc(props.event.meta.end_date_utc).local();
    const eventColorBrightnesss = getColorBrightness(cellColor);
    const classNameArray = ['stec-calendar-cell-event'];
    const cellTitleClassNameArray = ['stec-calendar-cell-event-title'];
    const isEventCancelled = props.event.meta.event_status === 'EventCancelled';
    const tooltipEventRef = useRef(0);
    const [showTooltip, setShowTooltip] = useState(false);
    const isMobileDevice = isMobile();

    const eventTitle = isEventCancelled ? <del>{props.event.title}</del> : props.event.title;

    let cellTitle = props.forceTitle ? eventTitle : '';

    if (eventCellStartMomentLocal.isSame(props.cellMoment, 'day')) {
        classNameArray.push('stec-calendar-cell-event-is-start')
        cellTitle = eventTitle;
    }

    if (eventCellEndMomentLocal.isSame(props.cellMoment, 'day')) {
        classNameArray.push('stec-calendar-cell-event-is-end')
    }

    if (eventStartMomentLocal.isBefore(moment())) {
        classNameArray.push('stec-calendar-cell-event-is-expired');
    }

    if (eventColorBrightnesss > 170) {
        classNameArray.push('stec-calendar-cell-event-bright-background');
        cellTitleClassNameArray.push('stec-calendar-cell-event-title-dark');
    }

    if (true === showTooltip) {
        classNameArray.push('stec-calendar-cell-event-has-tooltip');
    }

    return (
        <StecDiv
            className={classNameArray.join(' ')} style={{
                backgroundColor: cellColor,
                marginTop: 22 * props.eventMarginTop
            }}

            onClick={(e) => {

                if (quickOpen) {

                    e.stopPropagation();

                    switch (openEventIn) {

                        case 'external': {

                            let openLink = props.event.meta?.external_link?.url;

                            if (!openLink) {
                                openLink = getEventPermalink(props.event);
                            }

                            window.open(openLink, linksTarget);

                            break;

                        }

                        case 'single': {

                            const openLink = getEventPermalink(props.event);

                            window.open(openLink, linksTarget);

                            break;
                        }

                        default: {

                            const cellDateKey = props.cellMoment.format('YYYY-MM-DD');
                            const eventId = props.event.id;
                            const eventStartDate = props.event.meta.start_date;
                            const activeEventKey = `${cellDateKey}--${eventId}--${eventStartDate}`;

                            props.setActiveEventKey(activeEventKey);
                        }

                    }
                }
            }}

            onMouseOver={() => {
                if (!isMobileDevice) {
                    setShowTooltip(true);
                }
            }}

            onMouseOut={() => {
                if (!isMobileDevice) {
                    setShowTooltip(false);
                }
            }}

            ref={tooltipEventRef}>

            {showTooltip && <EventTooltip event={props.event} />}

            <StecSpan className={cellTitleClassNameArray.join(' ')}>
                {1 !== props.event.meta.approved && cellTitle && <i className='stec-calendar-cell-event-pending fa-regular fa-hourglass' />}
                {(props.event.meta.featured && cellTitle) && <i className='stec-calendar-cell-event-featured fa-solid fa-star' />}
              
                {cellTitle}
            </StecSpan>

        </StecDiv>
    )

}

/**
 * ? @todo maybe use a single component for this
 */
const CalendarCellEvent = (props) => {

    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');

    const inRelativeTimezone = !showInUserTimezone;

    return inRelativeTimezone ? <CalendarCellEventRelative {...props} /> : <CalendarCellEventLocal {...props} />;

}

export default CalendarCellEvent

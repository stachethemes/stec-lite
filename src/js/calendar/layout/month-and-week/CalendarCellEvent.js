import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getCellColor, getColorBrightness, isMobile } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useRef, useState } from 'react';
import EventTooltip from './EventTooltip';

const CalendarCellEvent = (props) => {

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

export default CalendarCellEvent

import { useCalendarScreenTypeValue, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { isMobile } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { _nx, sprintf } from '@wordpress/i18n';
import CalendarCellEvent from './CalendarCellEvent';

const CalendarCellEvents = (props) => {

    const isMobileDevice = isMobile()
    const forceDisplayTitle = useSettingsAtt('layouts__month_week_force_title');
    const cellStyleVariant = useSettingsAtt('layouts__month_week_style');

    const maybeHasEvents = [];
    const hiddenEvents = [];
    const screenType = useCalendarScreenTypeValue();

    let mayBeHasMore = '', added = 0, maxAdd;

    switch (screenType) {

        case 'mobile':
            maxAdd = -1;
            break;

        case 'tablet':
            maxAdd = 2;
            break;

        default:
            maxAdd = 3;

    }

    Array.isArray(props.eventsInCell) && props.eventsInCell.forEach((event, i) => {

        let eventMarginTop = 0;

        if (i === 0) {
            eventMarginTop = event.pos;
        }

        if (i > 0) {
            const prevEventPosition = props.eventsInCell[(i - 1)].pos;

            if (Math.abs(prevEventPosition - event.pos) > 1) {
                eventMarginTop = Math.abs(prevEventPosition - event.pos) - 1;
            }
        }

        switch (cellStyleVariant) {

            case 'fixed':

                if (event.pos <= maxAdd) {
                    maybeHasEvents.push(
                        <CalendarCellEvent
                            key={`${event.id}-${event.repeat_offset}`}
                            cellMoment={props.cellMoment} event={event}
                            eventMarginTop={eventMarginTop}
                            forceTitle={forceDisplayTitle}
                            setActiveEventKey={props.setActiveEventKey}
                        />
                    );
                } else {
                    hiddenEvents.push(<CalendarCellEvent
                        key={`${event.id}-${event.repeat_offset}`}
                        cellMoment={props.cellMoment}
                        event={event}
                        eventMarginTop={0}
                        forceTitle={true}
                        setActiveEventKey={props.setActiveEventKey}
                    />
                    );
                    added = added + 1;
                }
                break;

            case 'auto':
            default:
                maybeHasEvents.push(<CalendarCellEvent
                    key={`${event.id}-${event.repeat_offset}`}
                    cellMoment={props.cellMoment}
                    event={event}
                    eventMarginTop={eventMarginTop}
                    setActiveEventKey={props.setActiveEventKey}
                />);

        }

    })

    if (added > 0) {

        let displayMoreType;

        if (screenType !== 'mobile') {
            displayMoreType = <StecSpan className='stec-calendar-cell-events-more-text'>
                {sprintf('+%d %s', added, _nx('more', 'more', added, '+n more event(s)', 'stachethemes_event_calendar_lite'))}
            </StecSpan>
        } else {
            displayMoreType = <StecSpan className='stec-calendar-cell-events-more-icon' style={{
                backgroundColor: props.eventsInCell[0].meta.color
            }}>
                <StecSpan className='stec-calendar-cell-events-more-icon-text'>{added}</StecSpan>
            </StecSpan>
        }

        mayBeHasMore = <StecDiv className={`stec-calendar-cell-events-more ${isMobileDevice ? 'no-hover' : ''}`}>

            {displayMoreType}

            <StecDiv className='stec-calendar-cell-events-more-events'>
                {hiddenEvents}
            </StecDiv>

        </StecDiv>;
    }

    return (
        <>
            <StecDiv className='stec-calendar-cell-events'>
                {maybeHasEvents}
            </StecDiv>

            {mayBeHasMore}
        </>
    )
}

export default CalendarCellEvents
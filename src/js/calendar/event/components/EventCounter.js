import { getIsEventScheduled } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useEffect, useState } from 'react';

const CounterStatus = React.memo(({ counterStatus }) => {

    return (
        <StecDiv className='stec-event-counter-status'>
            <StecSpan className={counterStatus === 0 ? 'stec-event-counter-status-0' : ''}>
                {__('Starting in', 'stachethemes_event_calendar_lite')}
            </StecSpan>
            <StecSpan className={counterStatus === 1 ? 'stec-event-counter-status-1' : ''}>
                {__('In progress', 'stachethemes_event_calendar_lite')}
            </StecSpan>
            <StecSpan className={counterStatus === 2 ? 'stec-event-counter-status-2' : ''}>
                {__('Expired', 'stachethemes_event_calendar_lite')}
            </StecSpan>
        </StecDiv>
    )

});

CounterStatus.displayName = 'CounterStatus';

const DHMRender = React.memo(({ days, hours, minutes }) => {

    return (
        <>
            <StecDiv className='stec-event-counter-countdown-cell'>
                <StecSpan className='stec-event-counter-countdown-cell-num'>{days}</StecSpan>
                <StecSpan className='stec-event-counter-countdown-cell-label'>{__('Days', 'stachethemes_event_calendar_lite')}</StecSpan>
            </StecDiv>
            <StecDiv className='stec-event-counter-countdown-cell'>
                <StecSpan className='stec-event-counter-countdown-cell-num'>{hours}</StecSpan>
                <StecSpan className='stec-event-counter-countdown-cell-label'>{__('Hours', 'stachethemes_event_calendar_lite')}</StecSpan>
            </StecDiv>
            <StecDiv className='stec-event-counter-countdown-cell'>
                <StecSpan className='stec-event-counter-countdown-cell-num'>{minutes}</StecSpan>
                <StecSpan className='stec-event-counter-countdown-cell-label'>{__('Minutes', 'stachethemes_event_calendar_lite')}</StecSpan>
            </StecDiv>
        </>
    )

});

DHMRender.displayName = 'DHMRender';

const EventCounter = ({ event, style }) => {

    const start = event.meta.start_date;
    const end = event.meta.end_date;
    const timezone = event.meta.timezone;
    const isScheduled = getIsEventScheduled(event);

    const getCounterData = useCallback(() => {
        const nowMoment = moment();
        const startDateMoment = moment.tz(start, timezone);
        const endDateMoment = moment.tz(end, timezone);
        const startDiffSeconds = Math.max(0, startDateMoment.diff(nowMoment, 'seconds'));
        const endDiffSeconds = Math.max(0, endDateMoment.diff(nowMoment, 'seconds'));

        if (startDiffSeconds > 0) {
            const days = Math.floor(startDiffSeconds / 86400);
            const hours = Math.floor(startDiffSeconds % 86400 / 3600);
            const minutes = Math.floor(startDiffSeconds % 86400 % 3600 / 60);
            const seconds = Math.floor(startDiffSeconds % 86400 % 3600 % 60);

            return {
                status: 0,
                string: sprintf(__('%d\D %d\H %d\M %d\S', 'stachethemes_event_calendar_lite'), days, hours, minutes, seconds),
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }

        }
        else if (endDiffSeconds > 0) {
            const days = Math.floor(endDiffSeconds / 86400);
            const hours = Math.floor(endDiffSeconds % 86400 / 3600);
            const minutes = Math.floor(endDiffSeconds % 86400 % 3600 / 60);
            const seconds = Math.floor(endDiffSeconds % 86400 % 3600 % 60);

            return {
                status: 1,
                string: sprintf(__('%d\D %d\H %d\M %d\S', 'stachethemes_event_calendar_lite'), days, hours, minutes, seconds),
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }

        }
        else {
            return {
                status: 2,
                string: sprintf(__('%d\D %d\H %d\M %d\S', 'stachethemes_event_calendar_lite'), 0, 0, 0, 0),
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
    }, [end, start, timezone]);

    const initialCounterData = getCounterData();

    const [countData, setCountData] = useState(initialCounterData);

    useEffect(() => {

        if (false === isScheduled) {
            return;
        }

        const interval = setTimeout(() => {

            const timeLeftString = getCounterData();

            if (timeLeftString.string !== countData.string) {
                setCountData(timeLeftString);
            }

        }, 1000);

        return () => {
            clearTimeout(interval);
        }

    }, [countData, getCounterData, isScheduled]);

    if (false === isScheduled) {
        return null;
    }

    return (
        <StecDiv className='stec-event-counter' style={style}>

            <CounterStatus counterStatus={countData.status} />

            <StecDiv className='stec-event-counter-countdown'>

                <DHMRender days={countData.days} hours={countData.hours} minutes={countData.minutes} />

                <StecDiv className='stec-event-counter-countdown-cell'>
                    <StecSpan className='stec-event-counter-countdown-cell-num'>{countData.seconds}</StecSpan>
                    <StecSpan className='stec-event-counter-countdown-cell-label'>{__('Seconds', 'stachethemes_event_calendar_lite')}</StecSpan>
                </StecDiv>
            </StecDiv>


        </StecDiv>
    )
}

export default EventCounter

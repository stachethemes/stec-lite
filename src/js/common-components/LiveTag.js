import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';

const LiveTag = ({ event }) => {

    const [live, setLive] = useState(false);

    useEffect(() => {

        const checkIsLive = () => {

            const now = moment();
            const startMoment = moment.tz(event.meta.start_date, event.meta.timezone);
            const endMoment = moment.tz(event.meta.end_date, event.meta.timezone);

            return now.isBetween(startMoment, endMoment);

        }

        let interval;

        // Check if event is eligible for Live tag
        if (
            event?.location?.type &&
            'virtual' === event.location.type &&
            !['EventCancelled', 'EventPostponed'].includes(event.meta.event_status)
        ) {

            setLive(checkIsLive());

            interval = setInterval(() => {

                setLive(checkIsLive());

            }, 1000);

        }

        return () => {
            clearInterval(interval);
        }
    }, [event]);

    if (!live) {
        return null;
    }

    return (
        <StecDiv className='stec-tag-live'>
            {__('Live', 'stachethemes_event_calendar_lite')}
            <i className='fas fa-circle' />
        </StecDiv>
    )
}

export default LiveTag

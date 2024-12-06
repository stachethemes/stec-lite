import Event from '@Stec/JS/calendar/event/Event';
import { useCalendarMoment, useCustomLayoutEventsCache, useSettingsAtt, useShouldReverseOrder } from '@Stec/JS/calendar/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { useLayoutEffect, useState } from 'react';
import BoxGridEvents from './components/BoxGridEvents';
import LayoutBoxGridOuter from './components/LayoutBoxGridOuter';
import NextEventsButton from './components/NextEventsButton';
import NoEvents from './components/NoEvents';
import Skeleton from './Skeleton';

const LayoutBoxGridInner = ({ columns }) => {

    const minAllowedYear = useSettingsAtt('misc__min_allowed_year');
    const maxAllowedYear = useSettingsAtt('misc__max_allowed_year');
    const monthsAhead = useSettingsAtt('layouts__boxgrid_months_ahead');
    const calendarId = useSettingsAtt('id');
    const { safeValue: boxGridMomentSafe } = useCalendarMoment();
    const [activeEventKey, setActiveEventKey] = useState(false);
    const [page, setPage] = useState(0);
    const limit = useSettingsAtt('layouts__boxgrid_limit');
    const gutter = useSettingsAtt('layouts__boxgrid_gutter');
    const reverseOrder = useShouldReverseOrder();
    const offset = page * limit + limit;
    const pageResetEffectDep = boxGridMomentSafe.format('YMD');
    const cacheResetKey = pageResetEffectDep;

    // Retrieve start and end dates for the events depending on reverseOrder
    const getStartEndRanges = () => {

        if (reverseOrder) {

            const startMoment = moment(boxGridMomentSafe).startOf('month').subtract(monthsAhead, 'months');
            const endMoment = moment(boxGridMomentSafe).endOf('month');

            if (startMoment.year() < minAllowedYear) {
                startMoment.year(maxAllowedYear).startOf('year');
            }

            return {
                start: startMoment.format('YYYY-MM-DD'),
                end: endMoment.format('YYYY-MM-DD')
            }

        }

        const startMoment = moment(boxGridMomentSafe).startOf('month');
        const endMoment = moment(boxGridMomentSafe).startOf('month').add(monthsAhead, 'months');

        if (endMoment.year() > maxAllowedYear) {
            endMoment.year(minAllowedYear).endOf('year');
        }

        return {
            start: startMoment.format('YYYY-MM-DD'),
            end: endMoment.format('YYYY-MM-DD'),
        }

    }

    const { events: layoutEvents, ready: layoutEventsReady } = useCustomLayoutEventsCache({
        resetKey: cacheResetKey,
        sortEventsInYMDkeys: false,
        ...getStartEndRanges(),
        order: reverseOrder ? 'desc' : 'asc',
        threadIndex: `BOXGRID_${calendarId}`
    });

    const hasEvents = layoutEvents.length > 0 ? true : false;

    let activeEvent = false;

    if (layoutEventsReady && activeEventKey) {

        const filterEvents = layoutEvents.filter(item => activeEventKey === `${item.id}-${item.meta.start_date}`);

        if (filterEvents[0]) {
            activeEvent = filterEvents[0];
        } else {
            setActiveEventKey(false);
            activeEvent = false;
        }
    }

    // Reset show more page when date changes
    useLayoutEffect(() => {
        setPage(0);
    }, [pageResetEffectDep]);

    return (

        <StecDiv className='stec-layout-boxgrid'>

            {!layoutEventsReady && <Skeleton columns={columns} gutter={gutter} />}

            {
                layoutEventsReady && <>

                    {activeEventKey && <Event
                        key={activeEventKey}
                        event={activeEvent}
                        forceOpenIn={'modal'}
                        noPreviewWhenModal={true} // Prevents display of the preview container in the grid layout
                        active={true}
                        onActiveToggle={() => {
                            setActiveEventKey(false);
                        }}
                    />}

                    {!hasEvents && <NoEvents boxGridMoment={boxGridMomentSafe} />}

                    <BoxGridEvents
                        columns={columns}
                        gutter={gutter}
                        events={layoutEvents.slice(0, offset)}
                        onEventActive={(eventKey) => {
                            setActiveEventKey(eventKey)
                        }} />

                    <NextEventsButton
                        page={page}
                        setPage={setPage}
                        events={layoutEvents}
                    />
                </>}

        </StecDiv>
    )
}

const LayoutBoxGrid = () => {
    return (
        <LayoutBoxGridOuter Component={LayoutBoxGridInner} />
    )
}

export default LayoutBoxGrid

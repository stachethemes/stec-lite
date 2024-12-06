import Event from '@Stec/JS/calendar/event/Event';
import { useCalendarMoment, useLayoutEventsCache, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { useLayoutEffect, useState } from 'react';
import GridEvents from './components/GridEvents';
import LayoutGridOuter from './components/LayoutGridOuter';
import NextEventsButton from './components/NextEventsButton';
import NoEvents from './components/NoEvents';
import Skeleton from './Skeleton';

const LayoutGridInner = ({ columns }) => {

    const { safeValue: gridMomentSafe } = useCalendarMoment();
    const [activeEventKey, setActiveEventKey] = useState(false);
    const [page, setPage] = useState(0);
    const limit = useSettingsAtt('layouts__grid_limit');
    const gutter = useSettingsAtt('layouts__grid_gutter');
    const offset = page * limit + limit;
    const pageResetEffectDep = gridMomentSafe.format('YMD');
    const cacheResetKey = pageResetEffectDep;

    const { events: layoutEvents, ready: layoutEventsReady } = useLayoutEventsCache(cacheResetKey);

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

    // * Reset show more page when date changes
    useLayoutEffect(() => {
        setPage(0);
    }, [pageResetEffectDep]);

    return (

        <StecDiv className='stec-layout-grid'>

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

                    {!hasEvents && <NoEvents gridMoment={gridMomentSafe} />}

                    <GridEvents
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
                </>
            }


        </StecDiv>
    )
}

const LayoutGrid = () => {
    return (
        <LayoutGridOuter Component={LayoutGridInner} />
    )
}


export default LayoutGrid

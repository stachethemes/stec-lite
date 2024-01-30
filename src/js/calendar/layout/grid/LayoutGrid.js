import Button from '@Stec/CommonComponents/Button';
import Event from '@Stec/JS/calendar/event/Event';
import { useCalendarMoment, useCalendarScreenTypeValue, useLayoutEventsCache, useSettingsAtt, useShouldReverseOrder } from '@Stec/JS/calendar/hooks';
import GridEventSkeleton from '@Stec/JS/calendar/skeletons/GridEventSkeleton';
import { getMonthLabel } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { __, _x, sprintf } from '@wordpress/i18n';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import GridEvents from './GridEvents';

const NextMonthButton = React.forwardRef(({ gridGutter }, ref) => {

    const minAllowedYear = useSettingsAtt('misc__min_allowed_year');
    const maxAllowedYear = useSettingsAtt('misc__max_allowed_year');
    const reverseOrder = useShouldReverseOrder();
    const { safeValue: calendarMomentSafe, setValue: setCalendarMoment } = useCalendarMoment();
    const nextButtonEnabled = useSettingsAtt('layouts__grid_next_button');
    const moreButtonEnabled = useSettingsAtt('layouts__grid_more_button');

    if (!moreButtonEnabled || !nextButtonEnabled) {
        return null;
    }

    const nextMonthMoment = moment(calendarMomentSafe).startOf('month');

    if (reverseOrder) {
        nextMonthMoment.subtract(1, 'month');

        if (nextMonthMoment.year() < minAllowedYear) {
            nextMonthMoment.year(maxAllowedYear);
        }

    } else {
        nextMonthMoment.add(1, 'month');

        if (nextMonthMoment.year() > maxAllowedYear) {
            nextMonthMoment.year(minAllowedYear);
        }
    }

    const monthLabel = getMonthLabel(nextMonthMoment.month());
    const yearLabel = nextMonthMoment.year();
    const buttonLabel = [<i key='icon' className='fa-solid fa-calendar-alt' />, sprintf(_x('Go to %s, %s', 'month, year', 'stec'), monthLabel, yearLabel)];

    return (
        <Button onClick={() => {

            if (ref.current) {
                ref.current.scrollIntoView();
            }

            setCalendarMoment(nextMonthMoment);

        }} label={buttonLabel} style={{ marginTop: gridGutter, width: '100%' }} />
    )

});

NextMonthButton.displayName = 'NextMonthButton';

const LayoutGrid = () => {

    const scrollLastOffset = useRef(false);
    const gridRef = useRef(false);
    const { safeValue: gridMoment } = useCalendarMoment();
    const screenType = useCalendarScreenTypeValue();
    const [activeEventKey, setActiveEventKey] = useState(false);
    const [page, setPage] = useState(0);
    const limit = useSettingsAtt('layouts__grid_limit');
    const gutter = useSettingsAtt('layouts__grid_gutter');

    const offset = page * limit + limit;
    const gridGutter = `${gutter}px`;
    const desiredColumnsCount = useSettingsAtt('layouts__grid_columns');
    const pageResetEffectDep = gridMoment.format('YMD');
    const cacheResetKey = pageResetEffectDep;
    const { events: layoutEvents, ready: layoutEventsReady } = useLayoutEventsCache(cacheResetKey);

    let columnsCount;

    const hasEvents = layoutEvents.length > 0 ? true : false;
    const moreButtonEnabled = useSettingsAtt('layouts__grid_more_button');
    const showMore = moreButtonEnabled && hasEvents ? layoutEvents.slice(offset, offset + 1).length > 0 : false;

    switch (screenType) {
        case 'mobile':
            columnsCount = 1;
            break;

        case 'tablet':
            columnsCount = 2;
            break;

        default:
            columnsCount = desiredColumnsCount;
    }

    let activeEvent = false;

    if (layoutEventsReady && activeEventKey) {

        const foundEvent = layoutEvents.find(item => activeEventKey === `${item.id}-${item.meta.start_date}`);

        if (foundEvent) {
            activeEvent = foundEvent;
        } else {
            activeEvent = false;
            setActiveEventKey(false);
        }
    }

    // Reset show more page when date changes
    useLayoutEffect(() => {
        setPage(0);
    }, [pageResetEffectDep]);

    // Restore scroll position when event is closed
    useEffect(() => {
        if (false === activeEventKey && false !== scrollLastOffset.current) {
            window.scrollTo(0, scrollLastOffset.current);
            scrollLastOffset.current = false;
        }
    }, [activeEventKey]);

    if (false === layoutEventsReady) {

        const skeletons = [];

        for (let i = 0; i < columnsCount; i++) {
            skeletons.push(<GridEventSkeleton key={i} />);
        }

        return (
            <StecDiv className='stec-layout-grid' ref={gridRef}>

                <StecDiv style={{
                    width: '100%',
                    display: 'grid',
                    gap: gridGutter,
                    gridTemplateColumns: `repeat(${columnsCount}, 1fr)`
                }}>
                    {skeletons}
                </StecDiv>

            </StecDiv>
        )
    }

    if (false === hasEvents) {

        const month = gridMoment.month();
        const year = gridMoment.year();
        const monthLabel = getMonthLabel(month);

        return (
            <StecDiv className='stec-layout-grid'>

                {
                    <StecDiv className='stec-no-events-found-text'>
                        {sprintf(__('No events found in %s', 'stec'), [monthLabel, year].join(' '))}
                    </StecDiv>
                }

                <NextMonthButton gridGutter={gridGutter} ref={gridRef} />

            </StecDiv>
        )
    }

    if (false !== activeEventKey) {

        return (
            <StecDiv className='stec-layout-grid' ref={gridRef}>

                <Event
                    key={activeEventKey}
                    event={activeEvent}
                    active={true}
                    forceOpenIn={'modal'}
                    noPreviewWhenModal={true} // Prevents display of the preview container in the grid layout
                    onActiveToggle={() => {
                        setActiveEventKey(false);
                    }}
                />

            </StecDiv>
        )
    }

    const eventsToDisplay = layoutEvents.slice(0, offset);

    return (

        <StecDiv className='stec-layout-grid' ref={gridRef}>

            <GridEvents
                events={eventsToDisplay}
                columnsCount={columnsCount}
                gridGutter={gridGutter}
                onEventActive={(eventKey, scrollOffset) => {
                    scrollLastOffset.current = scrollOffset;
                    setActiveEventKey(eventKey)
                }} />

            {
                showMore &&

                <Button
                    onClick={() => {
                        setPage(page + 1);
                    }}
                    label={__('Show more', 'stec')}
                    style={{ marginTop: gridGutter, width: '100%' }}
                />
            }

            {
                !showMore && <NextMonthButton gridGutter={gridGutter} ref={gridRef} />
            }

        </StecDiv>
    )
}

export default LayoutGrid

import Button from '@Stec/CommonComponents/Button';
import Event from '@Stec/JS/calendar/event/Event';
import { useCalendarMoment, useCalendarScreenTypeValue, useLayoutEventsCache, useSettingsAtt, useShouldReverseOrder } from '@Stec/JS/calendar/hooks';
import BoxGridEventSkeleton from '@Stec/JS/calendar/skeletons/BoxGridEventSkeleton';
import { getMonthLabel } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { __, _x, sprintf } from '@wordpress/i18n';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BoxGridEvents from './BoxGridEvents';

const NextMonthButton = React.forwardRef(({ gutter }, ref) => {

    const minAllowedYear = useSettingsAtt('misc__min_allowed_year');
    const maxAllowedYear = useSettingsAtt('misc__max_allowed_year');
    const reverseOrder = useShouldReverseOrder();
    const { safeValue: calendarMomentSafe, setValue: setCalendarMoment } = useCalendarMoment();
    const nextButtonEnabled = useSettingsAtt('layouts__boxgrid_next_button');
    const moreButtonEnabled = useSettingsAtt('layouts__boxgrid_more_button');

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

        }} label={buttonLabel} style={{ marginTop: Math.max(5, gutter), width: '100%' }} />
    )

});

NextMonthButton.displayName = 'NextMonthButton';


const LayoutBoxGrid = () => {

    const scrollLastOffset = useRef(false);
    const boxGridRef = useRef(false);
    const { safeValue: boxGridMoment } = useCalendarMoment();
    const screenType = useCalendarScreenTypeValue();
    const [activeEventKey, setActiveEventKey] = useState(false);
    const [page, setPage] = useState(0);
    const limit = useSettingsAtt('layouts__boxgrid_limit');
    const gutter = useSettingsAtt('layouts__boxgrid_gutter');
    const offset = page * limit + limit;
    const gridGutter = `${gutter}px`;
    const desiredColumnsCount = useSettingsAtt('layouts__boxgrid_columns');
    const pageResetEffectDep = boxGridMoment.format('YMD');
    const cacheResetKey = pageResetEffectDep;

    const { events: layoutEvents, ready: layoutEventsReady } = useLayoutEventsCache(cacheResetKey);

    let columnsCount;

    const hasEvents = layoutEvents.length > 0 ? true : false;
    const moreButtonEnabled = useSettingsAtt('layouts__boxgrid_more_button');
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
            skeletons.push(<BoxGridEventSkeleton key={i} />);
        }

        return (
            <StecDiv className='stec-layout-boxgrid' ref={boxGridRef}>

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

        const month = boxGridMoment.month();
        const year = boxGridMoment.year();
        const monthLabel = getMonthLabel(month);

        return (
            <StecDiv className='stec-layout-boxgrid' ref={boxGridRef}>

                {
                    <StecDiv className='stec-no-events-found-text'>
                        {sprintf(__('No events found in %s', 'stec'), [monthLabel, year].join(' '))}
                    </StecDiv>
                }

                <NextMonthButton gutter={gutter} ref={boxGridRef} />

            </StecDiv>
        )
    }

    if (false !== activeEventKey) {

        return (
            <StecDiv className='stec-layout-boxgrid' ref={boxGridRef}>

                <Event
                    key={activeEventKey}
                    event={activeEvent}
                    forceOpenIn={'modal'}
                    noPreviewWhenModal={true} // Prevents display of the preview container in the grid layout
                    active={true}
                    onActiveToggle={() => {
                        setActiveEventKey(false);
                    }}
                />
            </StecDiv>
        )
    }

    const eventsToDisplay = layoutEvents.slice(0, offset);

    return (

        <StecDiv className='stec-layout-boxgrid' ref={boxGridRef}>

            <BoxGridEvents
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
                    style={{ marginTop: Math.max(5, gutter), width: '100%' }}
                />
            }

            {
                !showMore &&

                <NextMonthButton gutter={gutter} ref={boxGridRef} />
            }

        </StecDiv>
    )
}

export default LayoutBoxGrid

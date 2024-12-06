import { useCalendarScreenTypeValue, useSettingsAtt, useTopFilters } from '@Stec/JS/calendar/hooks';
import { useOutsideHandler } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import TopButton from './TopButton';
import TopFiltersMenu from './TopFiltersMenu';

const TopFilters = () => {

    const filterMenuRef = useRef(false);
    const [active, setActive] = useState(false);

    const topSingleLine = useSettingsAtt('calendar__top_single_line');
    const topLabels = useSettingsAtt('calendar__top_labels');
    const isMobileScreen = useCalendarScreenTypeValue() === 'mobile';

    const hideLabels = !topLabels || (topSingleLine && isMobileScreen);

    const { value: { items: filters } } = useTopFilters();

    useOutsideHandler(filterMenuRef, () => {
        setActive(false);
    });

    if (filters.length <= 0) {
        return null; // nothing to show so hide the filters menu
    }

    const label = [
        <i key='icon' className='stec-top-menu-filter-icon fa-solid fa-filter' />
    ]

    if (!hideLabels) {
        label.push(
            <span key='text' className='stec-top-menu-filter-label'>{__('Filter', 'stachethemes_event_calendar_lite')}</span>
        );
    }

    return (

        <StecDiv className='stec-top-menu-filters' ref={filterMenuRef}>

            <TopButton extraClass={'stec-top-menu-filter-button'} label={label} active={active} onClick={(e) => {
                setActive(!active);
            }} />

            {active && <TopFiltersMenu />}

        </StecDiv>
    )
}

export default TopFilters;
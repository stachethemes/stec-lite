import { useOutsideHandler } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { useRef, useState } from 'react';
import TopButton from './TopButton';
import TopFiltersMenu from './TopFiltersMenu';
import { useTopFilters } from '@Stec/JS/calendar/hooks';
import { __ } from '@wordpress/i18n';

const TopFilters = () => {

    const filterMenuRef = useRef(false);
    const [active, setActive] = useState(false);

    const { value: { items: filters } } = useTopFilters();

    useOutsideHandler(filterMenuRef, () => {
        setActive(false);
    });

    if (filters.length <= 0) {
        return null; // nothing to show so hide the filters menu
    }

    return (

        <StecDiv className='stec-top-menu-filters' ref={filterMenuRef}>

            <TopButton label={[
                <i key='icon' className='stec-top-menu-filter-icon fa-solid fa-filter' />,
                <span key='text' className='stec-top-menu-filter-label'>{__('Filter', 'stachethemes_event_calendar_lite')}</span>
            ]} active={active} onClick={(e) => {
                setActive(!active);
            }} />

            {active && <TopFiltersMenu />}

        </StecDiv>
    )
}

export default TopFilters;
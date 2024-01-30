import { StecDiv } from '@Stec/WebComponents';
import TopFilter from './TopFilter';
import { useTopFilters } from '@Stec/JS/calendar/hooks';
import { useState } from 'react';

const TopFiltersMenu = ({ staticMode = false }) => {

    const { value: { items: filters } } = useTopFilters();

    const [active, setActive] = useState(''); // assign active menu by id

    // filter out empty filters
    // empty filter is a filter with no items or with only one item with id 0
    const filtersNotEmpty = filters.filter(item => {
        const { items } = item;
        const hasValidItems = Array.isArray(items) && items.length > 0 && !(items.length === 1 && items[0].id === 0);
        return hasValidItems;
    });

    const classNameArray = ['stec-top-filters-menu'];

    if (staticMode) {
        classNameArray.push('static');
    }

    return (
        <StecDiv className={classNameArray.join(' ')}>
            {
                filtersNotEmpty.map(filter =>

                    <TopFilter key={filter.id} filter={filter} active={active} onClick={(filterId) => {

                        if (active === filterId) {
                            setActive('');
                        } else {
                            setActive(filterId);
                        }

                    }} />)
            }
        </StecDiv>
    )
}

export default TopFiltersMenu

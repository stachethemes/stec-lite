import { useTopFilters } from '@Stec/JS/calendar/hooks';
import { StecSpan, StecDiv } from '@Stec/WebComponents';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { cloneDeep } from 'lodash';

const InlineItemDisplay = ({ filterId, item }) => {

    const classNameArray = ['stec-top-filter-item-inline'];
    const { value: filters, setValue: setFilters } = useTopFilters();
    const isActive = item.active;

    const style = {
        backgroundColor: item.color || 'var(--stec-color-gray)'
    }

    if (item.id === 0) {
        classNameArray.push('stec-top-filter-item-inline-id-0');
    }

    if (isActive) {
        classNameArray.push('active');
    }

    const toggleItem = (e) => {

        e.stopPropagation();

        const newFiltersState = cloneDeep(filters);

        for (let filterKey in newFiltersState.items) {

            if (newFiltersState.items[filterKey].id !== filterId) {
                continue;
            }

            for (let filterItemKey in newFiltersState.items[filterKey].items) {

                if (newFiltersState.items[filterKey].items[filterItemKey].id !== item.id) {
                    continue;
                }

                newFiltersState.items[filterKey].items[filterItemKey].active = !item.active;

            }

        }

        setFilters(newFiltersState);

    }

    return <StecSpan className={classNameArray.join(' ')} style={style} onClick={toggleItem}>
        {isActive && <i className='fa-solid fa-check-square' />}
        {!isActive && <i className='fa-regular fa-square' />}
        <StecSpan dangerouslySetInnerHTML={{ __html: item.label }} />
    </StecSpan>

}

const InlineItemsDisplay = ({ filter }) => {

    const filterId = filter.id;
    const items = filter.items;

    if (items.length <= 0) {
        return null;
    }

    return (
        <StecDiv className={`stec-top-filter-inline stec-top-filter-inline-${filterId}`}>
            {
                items.map(item => <InlineItemDisplay key={item.id} filterId={filterId} item={item} />)
            }
        </StecDiv>
    )

}

function InlineItems() {

    const { value: { items: filters } } = useTopFilters();
    const displayCategories = useSettingsAtt('calendar__top_inline_categories');

    const displayFilters = {
        categories: false
    }

    displayFilters.categories = displayCategories;

    const filtersToDisplay = filters.filter(item => {
        return displayFilters[item.id] === true;
    });

    return (
        filtersToDisplay.map(item => <InlineItemsDisplay key={item.id} filter={item} />)
    )
}

export default InlineItems
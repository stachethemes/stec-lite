import { useTopFilters } from '@Stec/JS/calendar/hooks';
import { StecSpan, StecDiv } from '@Stec/WebComponents';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { htmlEntities } from '@Stec/JS/helpers';
import { cloneDeep } from 'lodash';

const InlineItemDisplay = ({ filterId, item }) => {

    const classNameArray = ['stec-top-filter-item-inline'];
    const { value: filters, setValue: setFilters } = useTopFilters();
    const inlineCategoriesMode = useSettingsAtt('calendar__top_inline_categories_mode');
    const isActive = item.active;


    if (item.id === 0) {
        classNameArray.push('stec-top-filter-item-inline-id-0');
    }

    if (isActive) {
        classNameArray.push('active');
    }

    const toggleSingleMode = (e) => {

        e.stopPropagation();

        const newFiltersState = cloneDeep(filters);

        for (let filterKey in newFiltersState.items) {

            if (newFiltersState.items[filterKey].id !== filterId) {
                continue;
            }

            const items = newFiltersState.items[filterKey].items;
            const theSelectedItem = items.find(test => test.id === item.id);
            const allChecked = items.every(test => test.active);
            const hasSiblingChecked = items.some(test => test.active && test.id !== item.id);
            const checkAll = !allChecked && !hasSiblingChecked && theSelectedItem.active;

            items.forEach(filterItem => {
                filterItem.active = checkAll || filterItem.id === item.id;
            });

        }

        setFilters(newFiltersState);

    }

    const toggleMultiMode = (e) => {

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

    return <StecSpan className={classNameArray.join(' ')} onClick={(e) => {

        if (inlineCategoriesMode === 'multi') {
            toggleMultiMode(e);
        } else {
            toggleSingleMode(e);
        }

    }}>

        <StecSpan className='stec-top-filter-item-inline-bgcolor' style={{
            backgroundColor: item.color || 'var(--stec-color-gray)'
        }}></StecSpan>
    

        {isActive && <i className='fa-solid fa-check-square' />}
        {!isActive && <i className='fa-regular fa-square' />}
        <StecSpan>
            {htmlEntities(item.label)}
        </StecSpan>
    </StecSpan>

}

const InlineItemsDisplay = ({ filter }) => {

    const filterId = filter.id;
    const items = filter.items;

    if (items.length <= 0) {
        return null;
    }

    if (items.length === 1 && items[0].id === 0) {
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
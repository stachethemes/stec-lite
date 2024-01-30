import { useTopFilters } from '@Stec/JS/calendar/hooks';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { cloneDeep } from 'lodash';

const TopFilterItemToggleAll = ({ filterId, items }) => {

    const { value: filters, setValue: setFilters } = useTopFilters();

    const toggle = () => {

        let allChecked = true;

        for (let itemKey in items) {
            if (false === items[itemKey].active) {
                allChecked = false;
                break;
            }
        }

        const itemsIdsToUpdate = items.map(item => item.id);
        const newFiltersState = cloneDeep(filters);

        for (let filterKey in newFiltersState.items) {

            if (newFiltersState.items[filterKey].id !== filterId) {
                continue;
            }

            for (let filterItemKey in newFiltersState.items[filterKey].items) {

                const filterItem = newFiltersState.items[filterKey].items[filterItemKey];

                if (itemsIdsToUpdate.includes(filterItem.id)) {
                    filterItem.active = !allChecked;
                }

            }
        }

        setFilters(newFiltersState);

    }

    return (
        <StecDiv className='stec-top-filter-item' onClick={(e) => {
            e.stopPropagation();
            toggle();
        }}>
            <i className='fa-solid fa-check-double' />
            <StecSpan>{__('Select All', 'stec')}</StecSpan>
        </StecDiv>
    )
}

export default TopFilterItemToggleAll
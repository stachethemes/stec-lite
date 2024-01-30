import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useTopFilters } from '@Stec/JS/calendar/hooks';
import { htmlEntities } from '@Stec/JS/helpers';
import { cloneDeep } from 'lodash';

const TopFilterItem = ({ filterId, item }) => {

    const { value: filters, setValue: setFilters } = useTopFilters();

    const classNameArray = ['stec-top-filter-item'];

    if (item.id === 0) {
        classNameArray.push('stec-top-filter-item-id-0');
    }

    return (
        <StecDiv className={classNameArray.join(' ')} onClick={(e) => {

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


        }}>
            <i className={item.active ? 'fa-solid fa-check-square' : 'fa-regular fa-square'} />
            <StecSpan>{htmlEntities(item.label)}</StecSpan>
        </StecDiv>
    )
}

export default TopFilterItem
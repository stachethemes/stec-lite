import { StecDiv } from '@Stec/WebComponents';
import { useState } from 'react';
import TopFilterItem from './TopFilterItem';
import TopFilterItemSearch from './TopFilterItemSearch';
import TopFilterItemToggleAll from './TopFilterItemToggleAll';

import { __, sprintf } from '@wordpress/i18n';

const TopFilterItems = ({ filter }) => {

    const [searchText, setSearchText] = useState('');

    const items = filter.items.filter(item => {

        if ('' === searchText) {
            return true;
        }

        return item.label.toLowerCase().includes(searchText.toLowerCase());

    });

    return (
        <StecDiv className='stec-top-filter-items-container'>

            {(items.length > 5 || searchText) && <TopFilterItemSearch placeholder={sprintf(__('Search %s', 'stachethemes_event_calendar_lite'), filter.label.toLowerCase())} onChange={(searchText) => {
                setSearchText(searchText);
            }} />}


            <StecDiv class='stec-top-filter-items'>

                {items.length > 1 && <TopFilterItemToggleAll filterId={filter.id} items={items} />}

                {items.map(fiterItem => <TopFilterItem key={fiterItem.id} filterId={filter.id} item={fiterItem} />)}

            </StecDiv>
        </StecDiv>
    )

}

export default TopFilterItems

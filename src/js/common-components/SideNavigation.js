import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { UncontrolledDelayedInputText } from './InputText';

function SideNavigation(props) {

    const [searchFilter, setSearchFilter] = useState('');

    const updateState = (activeId) => {

        const cloneItems = cloneDeep(props.items);

        cloneItems.forEach((itemLoop) => {
            itemLoop.active = itemLoop.id === activeId
        });

        props.setItems(cloneItems);

    }

    /**
     * A function that tries to match the searchFilter with the keywords of the items
     * should return items with the most matches
     * 
     * searchFilter global variable
     */
    const filterByKeyword = (items) => {

        // searchFilter value is empty
        if (!searchFilter) {
            return items;
        }

        const selectedItems = [];
        let searchFilterKeywords = searchFilter.split(' ').filter(keyword => keyword);

        // unique searchFilterKeywords
        searchFilterKeywords = searchFilterKeywords.filter((keyword, index) => searchFilterKeywords.indexOf(keyword) === index);

        items.forEach(item => {
            if (false === Array.isArray(item.keywords)) {
                return;
            }

            const itemKeywords = item.keywords;

            const matchedKeywordCount = itemKeywords.filter(keyword => {
                const transformedKeyword = keyword.trim().toLowerCase();
                return searchFilterKeywords.includes(transformedKeyword);
            }).length;

            const searchFilterKeywordCount = searchFilterKeywords.length;
            const percentageMatched = (matchedKeywordCount / searchFilterKeywordCount) * 100;

            if (percentageMatched >= 95) {
                selectedItems.push({ item, matchedKeywordCount });
            }
        });

        // Sort selectedItems by the number of matched keywords in descending order
        selectedItems.sort((a, b) => b.matchedKeywordCount - a.matchedKeywordCount);

        // Return the items sorted by the number of matched keywords
        return selectedItems.map(selectedItem => selectedItem.item);
    };

    const filteredItems = filterByKeyword(props.items);

    return (
        <StecDiv className='stec-side-navigation'>
            
            <UncontrolledDelayedInputText
                minLength={0}
                placeholder={__('Search option or feature', 'stec')}
                defaultValue={searchFilter}
                onChange={value => {
                    setSearchFilter(value);
                }}
                delay={200}
            />

            {filteredItems.map(item => {

                const classNameArray = ['stec-side-navigation-item'];

                if (true === item.active) {
                    classNameArray.push('active');
                }

                return (
                    <StecSpan key={item.id}
                        className={classNameArray.join(' ')}
                        onClick={() => {
                            updateState(item.id);
                        }}>
                        <i className={item.icon} />
                        <StecSpan>{item.label}</StecSpan>
                    </StecSpan>
                )

            })}

        </StecDiv>
    )
}

export default SideNavigation
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { cloneDeep } from 'lodash';
import { UncontrolledDelayedInputText } from './InputText';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';

function SideNavigation(props) {

    const updateState = (activeId) => {

        const cloneItems = cloneDeep(props.items);

        cloneItems.forEach((itemLoop) => {
            itemLoop.active = itemLoop.id === activeId
        });

        props.setItems(cloneItems);

    }

    const filterByKeyword = (items) => {

        // searchFilter value is empty
        if (!props.searchValue) {
            return items;
        }

        const selectedItems = [];


        items.forEach((item) => {

            const keywords = item.keywords;

            let found = false;

            keywords.forEach((keyword) => {
                if (keyword.toLowerCase().includes(props.searchValue.toLowerCase())) {
                    found = true;
                }
            });

            if (found) {
                selectedItems.push(item);
            }

        });

        return selectedItems;
        

    };

    const filteredItems = filterByKeyword(props.items);

    // Navigation to the tab where items are found ( if tab result is 1 )
    useEffect(()=>{

        if (!props.searchValue || filteredItems.length === 0) {
            return;
        }

        if (filteredItems.filter(item => item.active).length) {
            return;
        }

        const firstItem = filteredItems[0];

        if (firstItem.active) {
            return;
        }

        const cloneItems = cloneDeep(props.items);

        cloneItems.forEach((itemLoop) => {
            itemLoop.active = itemLoop.id === firstItem.id
        });

        props.setItems(cloneItems);

    }, [filteredItems, props]);
    

    return (
        <StecDiv className='stec-side-navigation'>
            
            <UncontrolledDelayedInputText
                delay={50}
                minLength={0}
                placeholder={__('Search option or feature', 'stachethemes_event_calendar_lite')}
                defaultValue={props.searchValue}
                onChange={value => {
                    props.setSearchValue(value);
                }}
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
import { StecDiv } from '@Stec/WebComponents';
import TopSearchInput from './TopSearchInput';
import TopSearchResults from './TopSearchResults';
import { useState } from 'react';

import { __ } from '@wordpress/i18n';

const TopSearchMenu = ({ onEventSelect }) => {

    const [searchText, setSearchText] = useState('');
    const classNameArray = ['stec-top-search-menu'];

    return (

        <StecDiv className={classNameArray.join(' ')}>

            <TopSearchInput placeholder={__('Search event', 'stec')} onChange={(value) => {
                setSearchText(value);
            }} />

            <TopSearchResults searchText={searchText} onEventSelect={onEventSelect} />
        </StecDiv>
    )
}

export default TopSearchMenu

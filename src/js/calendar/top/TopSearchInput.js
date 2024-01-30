import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useEffect } from 'react';

const TopSearchInput = ({ placeholder, onChange, delay = 500 }) => {

    let keyUpTimeout = '';

    const onKeyUp = (textToSearch) => {

        clearTimeout(keyUpTimeout);

        keyUpTimeout = setTimeout(() => {
            onChange(textToSearch);
        }, delay);

    }

    // Unsubscribe
    useEffect(() => {
        return () => {
            clearTimeout(keyUpTimeout);
        }
    });

    return (
        <StecDiv className='stec-top-search-menu-wrapper'>
            <StecDiv className='stec-top-search-menu-input-wrapper'>
            <StecSpan><i className='fa-solid fa-search' /></StecSpan>
                <input
                    className='stec-top-menu-search-input'
                    type='text'
                    name=''
                    placeholder={placeholder}
                    onKeyUp={(e) => {
                        onKeyUp(e.target.value);
                    }}
                />
            </StecDiv>
        </StecDiv>
    )
}

export default TopSearchInput

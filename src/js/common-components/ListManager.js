import ListManagerItem from '@Stec/CommonComponents/ListManagerItem';
import ListManagerTopControl from '@Stec/CommonComponents/ListManagerTopControl';
import Loader from '@Stec/CommonComponents/Loader';
import Pagination from '@Stec/CommonComponents/Pagination';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useRef } from 'react';

function ListManager(props) {

    const cachePropsRef = useRef(props);

    if (props.ready) {
        cachePropsRef.current = props;
    }

    return (
        <StecDiv className='stec-list-manager'>

            {
                false === props.ready &&
                <StecDiv className='stec-list-manager-loader'>
                    <Loader type="calendar-sprite" title={__('Refreshing list', 'stachethemes_event_calendar_lite')} />
                </StecDiv>
            }

            {
                props.ready && cachePropsRef.current.items.length <= 0 &&
                <StecDiv className='stec-list-manager-is-empty'>{__('No entries found', 'stachethemes_event_calendar_lite')}</StecDiv>
            }

            {
                cachePropsRef.current.items.length > 0 &&
                <>
                    {cachePropsRef.current.controls && <ListManagerTopControl controls={cachePropsRef.current.controls} />}

                    {cachePropsRef.current.items.map(item => {
                        return <ListManagerItem key={item.key} {...item} />
                    })}

                    <Pagination pages={cachePropsRef.current.totalPages} currentPage={cachePropsRef.current.currentPage} onClick={page => {
                        cachePropsRef.current.onPageChange(page);
                    }} />
                </>
            }

        </StecDiv>
    )
}

export default ListManager
import Button from '@Stec/CommonComponents/Button';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Accordeon from './Accordeon';

/**
 *  WHAT IS PREVIEW CONTAINER ??
 *  This is container that usually should hold list with event components (<Event />) elements
 *  However it may hold other stuff like the event submission form
 */
const PreviewContainer = (props) => {

    let children = [];

    const [page, setPage] = useState(0);

    if (props.children && false === Array.isArray(props.children)) {
        children = [props.children]
    } else {
        children = props.children;
    }

    if (children.length <= 0) {
        return '';
    }

    const limit = props.limit || children.length;
    const offset = page * limit + limit;
    const animateFrom = Math.max(0, offset - limit);
    const hasChildren = Array.isArray(children) && children.length > 0 ? true : false;
    const showMoreButton = props.moreButtonEnabled ?? true;
    const showMore = showMoreButton && hasChildren ? children.slice(offset, offset + 1).length > 0 : false;

    return (
        <>
            <StecDiv className='stec-preview-container'>
                <Accordeon animateFrom={animateFrom} until={offset}>{children}</Accordeon>
            </StecDiv>

            {
                showMore && <Button onClick={() => {
                    setPage(page + 1);
                }} label={__('Show more', 'stachethemes_event_calendar_lite')} style={{ marginTop: '10px', width: '100%' }} />
            }

            {!showMore && props.onListEnd && props.onListEnd()}
        </>
    )

}

export default PreviewContainer;
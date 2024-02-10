import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

function CommentsPreloader() {
    return (
        <StecDiv className='stec-event-comments-preloader'>
            <StecSpan className='stec-event-comments-preloader-icon'><i className='fas fa-comments' /></StecSpan>
            <StecSpan className='stec-event-comments-preloader-text'>{__('Loading Comments', 'stachethemes_event_calendar_lite')}</StecSpan>
        </StecDiv>
    )
}

export default CommentsPreloader
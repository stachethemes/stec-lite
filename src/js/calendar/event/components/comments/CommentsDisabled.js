import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

function CommentsDisabled({ style }) {
    return (
        <StecDiv className='stec-event-comments' style={style}>

            <StecDiv>

                <StecDiv className='stec-event-comments-empty'>
                    <i className='stec-event-comments-empty-icon fa-solid fa-comments' />
                    <StecSpan className='stec-event-comments-empty-big'>{__('Sorry, Comments are disabled', 'stec')}</StecSpan>
                    <StecSpan className='stec-event-comments-empty-small'>{__('You have chosen not to enable the comments section.', 'stec')}</StecSpan>
                </StecDiv>

            </StecDiv>

        </StecDiv>
    )
}

export default CommentsDisabled
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import EventAttachment from './EventAttachment';

const EventAttachments = ({ event, style }) => {

    const [open, setOpen] = useState(false);

    if (false === Array.isArray(event.meta.attachments) || event.meta.attachments.length <= 0) {
        return null;
    }

    return (
        <StecDiv className='stec-attachments-list' style={style}>

            <StecDiv className='stec-attachments-list-head' onClick={() => {
                setOpen(!open);
            }}>
                <StecDiv className='stec-attachments-list-title'>
                    <i className='fa-solid fa-file-download' />{__('Attachments', 'stachethemes_event_calendar_lite')}
                </StecDiv>

                {
                    open ? <i className='fa-solid fa-minus' /> : <i className='fa-solid fa-plus' />
                }
            </StecDiv>

            <StecDiv>
                {
                    open && event.meta.attachments.map(attachment => {
                        return <EventAttachment key={attachment.id} attachment={attachment} />
                    })
                }
            </StecDiv>
        </StecDiv>
    )
}

export default EventAttachments

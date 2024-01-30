import Button from '@Stec/CommonComponents/Button';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

const EventAttachment = ({ attachment }) => {

    const caption = attachment.caption || attachment.url;

    return (
        <StecDiv className='stec-attachment'>
            <a download href={attachment.url}>{caption}</a>

            <Button href={attachment.url} label={[
                <i key='icon' className='fa-solid fa-download' />, __('Download', 'stec')
            ]} extra={{
                download: true
            }} />

        </StecDiv>
    )
}

export default EventAttachment

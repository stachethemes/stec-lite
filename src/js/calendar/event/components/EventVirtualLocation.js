import Button from '@Stec/CommonComponents/Button';
import LiveTag from '@Stec/CommonComponents/LiveTag';
import Tag from '@Stec/CommonComponents/Tag';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-hot-toast';
import QRCode from "react-qr-code";

function EventVirtualLocation({ event, style }) {

    if (event.location.protected === true) {

        return <StecDiv className='stec-event-location-protected'>
            {__('Only logged-in users can see this location', 'stec')}
        </StecDiv>
    }

    return (
        <StecDiv
            className='stec-event-location-virtual'
            style={style}>

            <LiveTag event={event} />

            <Tag
                backgroundColor='var(--stec-color-blue)'
                color='#fff'
                label={[<i key='icon' className='fa-solid fa-wifi' />, __('Virtual', 'stec')]} />

            <StecDiv className='stec-event-location-virtual-flex'>

                <StecDiv className="stec-event-location-virtual-qr-code">
                    <QRCode value={event.location.address} size={132} />
                </StecDiv>

                <StecDiv>
                    {
                        event.location.description &&
                        <StecDiv className="stec-event-location-virtual-details">
                            <StecSpan>{__('Details', 'stec')}</StecSpan>
                            <StecDiv dangerouslySetInnerHTML={{ __html: event.location.description }} />
                        </StecDiv>
                    }

                    <Button
                        className='green'
                        label={__('Join this event', 'stec')} href={event.location.address} />

                    <Button
                        className='blue'
                        style={{ marginLeft: 6 }}
                        label={__('Copy address link', 'stec')} onClick={(e) => {

                            try {
                                e.preventDefault();
                                navigator.clipboard.writeText(event.location.address);
                                toast.success(__('Link copied to clipboard', 'stec'));
                            } catch (e) {
                                toast.error(__('Unable to copy link to clipboard', 'stec'));
                            }

                        }} />

                </StecDiv>

            </StecDiv>


        </StecDiv>
    )
}

export default EventVirtualLocation
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

function EventLocationAddress({ event, style }) {

    const addressOrder = useSettingsAtt('misc__address_order');
    const addressOrderArray = addressOrder.split(',');

    return (
        <StecDiv className='stec-event-location-address' style={style}>

            {
                addressOrderArray.map(orderKey => {

                    switch (orderKey) {

                        case 'country': {

                            if (!event.location.country) {
                                return '';
                            }

                            return (
                                <StecDiv key={orderKey}>
                                    <StecSpan>{__('Country', 'stec')}</StecSpan>
                                    <StecSpan>{event.location.country}</StecSpan>
                                </StecDiv>
                            )
                        }

                        case 'state': {

                            if (!event.location.state) {
                                return '';
                            }

                            return (
                                <StecDiv key={orderKey}>
                                    <StecSpan>{__('State', 'stec')}</StecSpan>
                                    <StecSpan>{event.location.state}</StecSpan>
                                </StecDiv>
                            )
                        }

                        case 'city': {

                            if (!event.location.city) {
                                return '';
                            }

                            return (
                                <StecDiv key={orderKey}>
                                    <StecSpan>{__('City', 'stec')}</StecSpan>
                                    <StecSpan>{event.location.city}</StecSpan>
                                </StecDiv>
                            )
                        }

                        case 'address': {

                            if (!event.location.address) {
                                return '';
                            }

                            return (
                                <StecDiv key={orderKey}>
                                    <StecSpan>{__('Address', 'stec')}</StecSpan>
                                    <StecSpan>{event.location.address}</StecSpan>
                                </StecDiv>
                            )
                        }

                        case 'postal_code': {

                            if (!event.location.postal_code) {
                                return '';
                            }

                            return (
                                <StecDiv key={orderKey}>
                                    <StecSpan>{__('Postal code', 'stec')}</StecSpan>
                                    <StecSpan>{event.location.postal_code}</StecSpan>
                                </StecDiv>
                            )
                        }
                    }

                })
            }

        </StecDiv>
    )
}

export default EventLocationAddress
import { getMonthLabel } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { __, sprintf } from '@wordpress/i18n';

const NoEvents = ({
    boxGridMoment
}) => {

    const month = boxGridMoment.month();
    const year = boxGridMoment.year();
    const monthLabel = getMonthLabel(month);

    return (
        <StecDiv className='stec-no-events-found-text'>
            <i className='fa-solid fa-calendar-alt' />
            {sprintf(__('No events found in %s', 'stachethemes_event_calendar_lite'), [monthLabel, year].join(' '))}
        </StecDiv>
    )
}

export default NoEvents
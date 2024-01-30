import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { beautifyEventTimespan } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';

function EventDate({ event, style }) {

    const dateFormat = useSettingsAtt('calendar__date_format');
    const timeFormat = useSettingsAtt('calendar__time_format');
    const dateShowTzOffset = useSettingsAtt('calendar__show_tz_offset');
    const showInUserTimezone = useSettingsAtt('calendar__use_user_timezone');

    const dateTime = beautifyEventTimespan(
        {
            event: event,
            dateFormat: dateFormat,
            timeFormat: timeFormat,
            showUtcOffset: dateShowTzOffset,
            fullMonth: true,
            forceHideEnd: false,
            showInUserTimezone: showInUserTimezone
        }
    );

    return (
        <StecDiv className='stec-event-date' style={style}>{dateTime}</StecDiv>
    )
}

export default EventDate
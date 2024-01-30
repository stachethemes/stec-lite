import Button from '@Stec/CommonComponents/Button';
import PreviewEvents from '@Stec/JS/calendar/common/PreviewEvents';
import { useAgendaSliderKey, useCalendarMoment, useLayoutEventsCache, useSettingsAtt, useShouldReverseOrder } from '@Stec/JS/calendar/hooks';
import { getMonthLabel } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __, _x, sprintf } from '@wordpress/i18n';
import { useRef } from 'react';

const NextButton = React.forwardRef((props, ref) => {

    const minAllowedYear = useSettingsAtt('misc__min_allowed_year');
    const maxAllowedYear = useSettingsAtt('misc__max_allowed_year');
    const reverseOrder = useShouldReverseOrder();
    const { setValue: setAgendaSliderKey } = useAgendaSliderKey();
    const { safeValue: calendarMomentSafe, setValue: setCalendarMoment } = useCalendarMoment();
    const moreButtonEnabled = useSettingsAtt('layouts__agenda_list_more_button');
    const nextButtonEnabled = useSettingsAtt('layouts__agenda_list_next_button');

    // Note is "more" button is disabled it will also disable the "next" button
    if (!nextButtonEnabled || !moreButtonEnabled) {
        return '';
    }

    const nextMonthMoment = moment(calendarMomentSafe).startOf('month');

    if (reverseOrder) {
        nextMonthMoment.subtract(1, 'month');

        if (nextMonthMoment.year() < minAllowedYear) {
            nextMonthMoment.year(maxAllowedYear);
        }

    } else {
        nextMonthMoment.add(1, 'month');

        if (nextMonthMoment.year() > maxAllowedYear) {
            nextMonthMoment.year(minAllowedYear);
        }
    }

    const monthLabel = getMonthLabel(nextMonthMoment.month());
    const yearLabel = nextMonthMoment.year();
    const buttonLabel = [<i key='icon' className='fa-solid fa-calendar-alt' />, sprintf(_x('Go to %s, %s', 'month, year', 'stec'), monthLabel, yearLabel)];

    return (
        <Button onClick={() => {

            if (ref.current) {
                const agendaKey = calendarMomentSafe.format('YMD');
                ref.current.scrollIntoView();
                setAgendaSliderKey(agendaKey);
            }

            setCalendarMoment(nextMonthMoment);

        }} label={buttonLabel} style={{ marginTop: '10px', width: '100%' }} />
    )

});

NextButton.displayName = 'NextButton';

const AgendaList = ({ day, month, year }) => {

    const agendaListRef = useRef(false);
    const agendaListLimit = useSettingsAtt('layouts__agenda_list_limit');
    const monthLabel = getMonthLabel(month);
    const cacheResetKey = `${day}-${month}-${year}`;
    const { events: layoutEvents, ready: layoutEventsReady } = useLayoutEventsCache(cacheResetKey);
    const reverseOrder = useShouldReverseOrder();
    const moreButtonEnabled = useSettingsAtt('layouts__agenda_list_more_button');

    const getEventsListLabel = () => {

        if (reverseOrder) {

            return sprintf(__('Events from %s and prior', 'stec'), [day, monthLabel, year].join(' '));
        }

        return sprintf(__('Events since %s', 'stec'), [day, monthLabel, year].join(' '));

    }

    const eventsListLabel = getEventsListLabel();

    return (
        <StecDiv className={'stec-layout-agenda-list'} ref={agendaListRef}>

            {
                (layoutEventsReady && layoutEvents.length <= 0) &&

                <>
                    <StecDiv className='stec-no-events-found-text'>
                        {__('No events found', 'stec')}
                    </StecDiv>

                    <NextButton ref={agendaListRef} />
                </>
            }

            {
                layoutEvents.length > 0 &&

                <>
                    <StecSpan className='stec-layout-agenda-list-title'>{eventsListLabel}</StecSpan>

                    <PreviewEvents
                        moreButtonEnabled={moreButtonEnabled}
                        limit={agendaListLimit}
                        events={layoutEvents}
                        onListEnd={() => {

                            return <NextButton ref={agendaListRef} />

                        }} />
                </>
            }

        </StecDiv>
    )
}

export default AgendaList
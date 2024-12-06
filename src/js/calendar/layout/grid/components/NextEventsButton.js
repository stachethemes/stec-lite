import Button from '@Stec/CommonComponents/Button';
import { useCalendarMoment, useSettingsAtt, useShouldReverseOrder } from '@Stec/JS/calendar/hooks';
import { getMonthLabel } from '@Stec/JS/helpers';
import { __, _x, sprintf } from '@wordpress/i18n';
import { useRef } from 'react';

const NextMonthButton = () => {

    const minAllowedYear = useSettingsAtt('misc__min_allowed_year');
    const maxAllowedYear = useSettingsAtt('misc__max_allowed_year');
    const reverseOrder = useShouldReverseOrder();
    const { safeValue: calendarMomentSafe, setValue: setCalendarMoment } = useCalendarMoment();
    const nextButtonEnabled = useSettingsAtt('layouts__grid_next_button');
    const moreButtonEnabled = useSettingsAtt('layouts__grid_more_button');
    const buttonRef = useRef(null);

    if (!moreButtonEnabled || !nextButtonEnabled) {
        return null;
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
    const buttonLabel = [<i key='icon' className='fa-solid fa-calendar-alt' />, sprintf(_x('Go to %s, %s', 'month, year', 'stachethemes_event_calendar_lite'), monthLabel, yearLabel)];

    return (
        <Button ref={buttonRef} onClick={() => {

            if (buttonRef.current) {

                const parentGrid = buttonRef.current.closest('.stec-layout-grid');

                if (parentGrid) {
                    parentGrid.scrollIntoView();
                }

            }

            setCalendarMoment(nextMonthMoment);

        }} label={buttonLabel} style={{ marginTop: 10, width: '100%' }} />
    )
};

const NextEventsButton = ({ page, setPage, events }) => {

    const limit = useSettingsAtt('layouts__grid_limit');
    const nextButtonEnabled = useSettingsAtt('layouts__grid_next_button');
    const moreButtonEnabled = useSettingsAtt('layouts__grid_more_button');
    const offset = page * limit + limit;
    const hasEvents = events.length > 0 ? true : false;
    const showMore = moreButtonEnabled && hasEvents ? events.slice(offset, offset + 1).length > 0 : false;

    if (!nextButtonEnabled && !moreButtonEnabled) {
        return null;
    }

    if (showMore) {
        return (
            <Button
                onClick={() => {
                    setPage(page + 1);
                }}
                label={__('Show more', 'stachethemes_event_calendar_lite')}
                style={{ marginTop: 10, width: '100%' }}
            />
        )
    }

    return <NextMonthButton />

};

export default NextEventsButton
import { useAgendaSliderKey, useCalendarMoment, useCalendarScreenTypeValue, useAvailableLayouts, useCurrentLayout, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getMonthLabels } from '@Stec/JS/helpers';
import { useMemo } from 'react';
import TopButton from './TopButton';
import TopScrollMenu from './TopScrollMenu';
import { useShouldReverseOrder } from '../hooks';

const TopDatePicker = ({ forceFullLabels = false }) => {

    const { value: activeLayout } = useCurrentLayout();
    const { setValue: setAgendaSliderKey } = useAgendaSliderKey();
    const { safeValue: calendarMomentSafe, setValue: setCalendarMoment } = useCalendarMoment();
    const screenType = useCalendarScreenTypeValue();
    const minAllowedYear = useSettingsAtt('misc__min_allowed_year');
    const maxAllowedYear = useSettingsAtt('misc__max_allowed_year');
    const topNavButtonsEnabled = useSettingsAtt('calendar__top_nav_buttons');
    const topNavDatecpikerEnabled = useSettingsAtt('calendar__top_datepicker_menu');
    const shouldReverseOrder = useShouldReverseOrder();

    const yearsArray = useMemo(() => {

        const yearsArray = [];

        for (let y = minAllowedYear; y <= maxAllowedYear; y++) {
            yearsArray.push({
                value: y,
                label: y
            });
        }

        return yearsArray;

    }, [maxAllowedYear, minAllowedYear]);

    const monthsArray = useMemo(() => {

        const monthsLabelsLength = (!forceFullLabels && screenType === 'mobile') ? 'short' : '';

        const monthsLabels = getMonthLabels(monthsLabelsLength);

        return monthsLabels.map((monthLabel, monthNum) => {

            return {
                value: monthNum,
                label: monthLabel
            }
        });

    }, [forceFullLabels, screenType]);

    const daysInMonth = calendarMomentSafe.daysInMonth();

    const daysInMonthArray = useMemo(() => {

        const daysArray = [];

        for (let d = 1; d <= daysInMonth; d++) {
            daysArray.push({
                value: d,
                label: d
            });
        }

        return daysArray;

    }, [daysInMonth]);

    const onDropDownClick = (value, type) => {

        const agendaKey = calendarMomentSafe.format('YMD');

        setCalendarMoment(calendarMomentSafe.set(type, value));

        setAgendaSliderKey(agendaKey);
    }

    const onPrevNextClick = (direction) => {

        let interval;

        switch (activeLayout) {

            case 'day':
                interval = 'day';
                break;

            case 'week':
                interval = 'week';
                break;

            default:
                interval = 'month';
        }

        if ('next' === direction) {

            if (shouldReverseOrder) {
                setCalendarMoment(calendarMomentSafe.endOf(interval).add(1, interval));
            } else {
                setCalendarMoment(calendarMomentSafe.startOf(interval).add(1, interval));
            }

        } else if ('prev' === direction) {
            if (shouldReverseOrder) {
                setCalendarMoment(calendarMomentSafe.endOf(interval).subtract(1, interval));
            } else {
                setCalendarMoment(calendarMomentSafe.startOf(interval).subtract(1, interval));
            }
        }

        const agendaKey = calendarMomentSafe.format('YMD');

        setAgendaSliderKey(agendaKey);
    }

    const PrevButton = () => {

        if (!topNavButtonsEnabled) {
            return null;
        }

        const label = <i className='fa-solid fa-chevron-left' />;

        const onClick = () => {
            onPrevNextClick('prev');
        }

        return <TopButton label={label} onClick={onClick} />

    }

    const NextButton = () => {

        if (!topNavButtonsEnabled) {
            return null;
        }

        const label = <i className='fa-solid fa-chevron-right' />;

        const onClick = () => {
            onPrevNextClick('next');
        }

        return <TopButton label={label} onClick={onClick} />

    }

    switch (activeLayout) {

        case 'map':
        case 'boxgrid':
        case 'grid':
        case 'month':
            return (
                <>

                    <PrevButton />

                    {
                        topNavDatecpikerEnabled && <>
                            <TopScrollMenu key='monthDatePicker' type='month' selected={calendarMomentSafe.month()} optionsArray={monthsArray} onClick={onDropDownClick} />
                            <TopScrollMenu key='yearDatePicker' type='year' selected={calendarMomentSafe.year()} optionsArray={yearsArray} onClick={onDropDownClick} />

                        </>
                    }

                    <NextButton />

                </>
            )

        case 'agenda':
        default:
            return (
                <>
                    <PrevButton />

                    {
                        topNavDatecpikerEnabled && <>
                            <TopScrollMenu key='dayDatePicker' type='date' selected={calendarMomentSafe.date()} optionsArray={daysInMonthArray} onClick={onDropDownClick} />
                            <TopScrollMenu key='monthDatePicker' type='month' selected={calendarMomentSafe.month()} optionsArray={monthsArray} onClick={onDropDownClick} />
                            <TopScrollMenu key='yearDatePicker' type='year' selected={calendarMomentSafe.year()} optionsArray={yearsArray} onClick={onDropDownClick} />

                        </>
                    }

                    <NextButton />
                </>
            )
    }
}

export default TopDatePicker;
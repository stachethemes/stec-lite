import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import Button from './Button';
import DatePicker from './DatePicker';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import InputRadio from './InputRadio';
import InputSelect from './InputSelect';
import InputText from './InputText';
import Spacer from './Spacer';

const ExdateGenerator = ({ display, value, onExdateChange }) => {

    const [exdate, setExdate] = useState('');
    const exdates = Array.isArray(value) ? value : [];

    useEffect(() => {

        if (false === display && value.length > 0) {
            onExdateChange([]);
        }

    }, [display, onExdateChange, value.length]);

    if (false === display) {
        return '';
    }

    return (
        <>
            <Spacer />

            <StecDiv className='stec-rrule-generator-exdates'>

                <DatePicker
                    value={exdate}
                    title={__('EXDATE', 'stachethemes_event_calendar_lite')}
                    description={__('Add date exception', 'stachethemes_event_calendar_lite')}
                    onChange={(value) => {
                        setExdate(value);
                    }} />

                <Button className='blue' label={__('Add Exdate', 'stachethemes_event_calendar_lite')} onClick={() => {

                    if (exdate && true === moment(exdate).isValid()) {
                        if (false === exdates.includes(exdate)) {
                            onExdateChange([...exdates, exdate]);
                        }
                    }

                }} />

            </StecDiv>

            {exdates.length > 0 && exdates.map(date => {
                return (
                    <StecSpan key={date} className='stec-rrule-exdate'>
                        <StecSpan>{date}</StecSpan>
                        <i className='fas fa-times' onClick={() => {
                            const newExdates = exdates.filter(filterDate => {
                                return filterDate !== date;
                            });

                            onExdateChange(newExdates);
                        }} />
                    </StecSpan>
                )
            })}
        </>


    );
}

const RRuleGenerator = ({
    title,
    description,
    rrule,
    min,
    manual,
    onModeChange,
    onRRuleChange,
    onExdateChange,
    exdate,
    absoluteDropdown = false
}) => {

    const repeatOptions = [
        { value: '', label: __('Disabled', 'stachethemes_event_calendar_lite') },
        { value: 'daily', label: __('Daily', 'stachethemes_event_calendar_lite') },
        { value: 'weekly', label: __('Weekly', 'stachethemes_event_calendar_lite') },
        { value: 'monthly-by-day', label: __('Monthly by day', 'stachethemes_event_calendar_lite') },
        { value: 'monthly-by-date', label: __('Monthly by date', 'stachethemes_event_calendar_lite') },
        { value: 'yearly-by-day', label: __('Yearly by day', 'stachethemes_event_calendar_lite') },
        { value: 'yearly-by-date', label: __('Yearly by date', 'stachethemes_event_calendar_lite') },
        { value: 'manual', label: __('Manual Mode (Advanced)', 'stachethemes_event_calendar_lite') },
    ];

    const dailyIntervalOptions = [
        { value: 1, label: __('Every day', 'stachethemes_event_calendar_lite') },
        { value: 2, label: __('Every other day', 'stachethemes_event_calendar_lite') },
        { value: 3, label: __('Every 3rd day', 'stachethemes_event_calendar_lite') },
        { value: 4, label: __('Every 4th day', 'stachethemes_event_calendar_lite') },
        { value: 5, label: __('Every 5th day', 'stachethemes_event_calendar_lite') },
        { value: 6, label: __('Every 6th day', 'stachethemes_event_calendar_lite') },
        { value: 7, label: __('Every 7th day', 'stachethemes_event_calendar_lite') },
        { value: 8, label: __('Every 8th day', 'stachethemes_event_calendar_lite') },
        { value: 9, label: __('Every 9th day', 'stachethemes_event_calendar_lite') },
        { value: 10, label: __('Every 10th day', 'stachethemes_event_calendar_lite') },
        { value: 11, label: __('Every 11th day', 'stachethemes_event_calendar_lite') },
        { value: 12, label: __('Every 12th day', 'stachethemes_event_calendar_lite') },
        { value: 13, label: __('Every 13th day', 'stachethemes_event_calendar_lite') },
        { value: 14, label: __('Every 14th day', 'stachethemes_event_calendar_lite') },
        { value: 15, label: __('Every 15th day', 'stachethemes_event_calendar_lite') },
        { value: 16, label: __('Every 16th day', 'stachethemes_event_calendar_lite') },
        { value: 17, label: __('Every 17th day', 'stachethemes_event_calendar_lite') },
        { value: 18, label: __('Every 18th day', 'stachethemes_event_calendar_lite') },
        { value: 19, label: __('Every 19th day', 'stachethemes_event_calendar_lite') },
        { value: 20, label: __('Every 20th day', 'stachethemes_event_calendar_lite') },
        { value: 21, label: __('Every 21st day', 'stachethemes_event_calendar_lite') },
        { value: 22, label: __('Every 22nd day', 'stachethemes_event_calendar_lite') },
        { value: 23, label: __('Every 23rd day', 'stachethemes_event_calendar_lite') },
        { value: 24, label: __('Every 24th day', 'stachethemes_event_calendar_lite') },
        { value: 25, label: __('Every 25th day', 'stachethemes_event_calendar_lite') },
        { value: 26, label: __('Every 26th day', 'stachethemes_event_calendar_lite') },
        { value: 27, label: __('Every 27th day', 'stachethemes_event_calendar_lite') },
        { value: 28, label: __('Every 28th day', 'stachethemes_event_calendar_lite') },
        { value: 29, label: __('Every 29th day', 'stachethemes_event_calendar_lite') },
        { value: 30, label: __('Every 30th day', 'stachethemes_event_calendar_lite') }
    ];

    const weeklyIntervalOptions = [
        { value: 1, label: __('Every week', 'stachethemes_event_calendar_lite') },
        { value: 2, label: __('Every other week', 'stachethemes_event_calendar_lite') },
        { value: 3, label: __('Every 3rd week', 'stachethemes_event_calendar_lite') },
        { value: 4, label: __('Every 4th week', 'stachethemes_event_calendar_lite') },
        { value: 5, label: __('Every 5th week', 'stachethemes_event_calendar_lite') },
        { value: 6, label: __('Every 6th week', 'stachethemes_event_calendar_lite') },
        { value: 7, label: __('Every 7th week', 'stachethemes_event_calendar_lite') },
        { value: 8, label: __('Every 8th week', 'stachethemes_event_calendar_lite') },
        { value: 9, label: __('Every 9th week', 'stachethemes_event_calendar_lite') },
        { value: 10, label: __('Every 10th week', 'stachethemes_event_calendar_lite') },
        { value: 11, label: __('Every 11th week', 'stachethemes_event_calendar_lite') },
        { value: 12, label: __('Every 12th week', 'stachethemes_event_calendar_lite') },
        { value: 13, label: __('Every 13th week', 'stachethemes_event_calendar_lite') },
        { value: 14, label: __('Every 14th week', 'stachethemes_event_calendar_lite') },
        { value: 15, label: __('Every 15th week', 'stachethemes_event_calendar_lite') },
        { value: 16, label: __('Every 16th week', 'stachethemes_event_calendar_lite') },
        { value: 17, label: __('Every 17th week', 'stachethemes_event_calendar_lite') },
        { value: 18, label: __('Every 18th week', 'stachethemes_event_calendar_lite') },
        { value: 19, label: __('Every 19th week', 'stachethemes_event_calendar_lite') },
        { value: 20, label: __('Every 20th week', 'stachethemes_event_calendar_lite') },
        { value: 21, label: __('Every 21st week', 'stachethemes_event_calendar_lite') },
        { value: 22, label: __('Every 22nd week', 'stachethemes_event_calendar_lite') },
        { value: 23, label: __('Every 23rd week', 'stachethemes_event_calendar_lite') },
        { value: 24, label: __('Every 24th week', 'stachethemes_event_calendar_lite') },
        { value: 25, label: __('Every 25th week', 'stachethemes_event_calendar_lite') },
        { value: 26, label: __('Every 26th week', 'stachethemes_event_calendar_lite') }
    ];

    const weeklyByDayOptions = [
        { value: "MO", label: __('Monday', 'stachethemes_event_calendar_lite') },
        { value: "TU", label: __('Tuesday', 'stachethemes_event_calendar_lite') },
        { value: "WE", label: __('Wednesday', 'stachethemes_event_calendar_lite') },
        { value: "TH", label: __('Thursday', 'stachethemes_event_calendar_lite') },
        { value: "FR", label: __('Friday', 'stachethemes_event_calendar_lite') },
        { value: "SA", label: __('Saturday', 'stachethemes_event_calendar_lite') },
        { value: "SU", label: __('Sunday', 'stachethemes_event_calendar_lite') }
    ];

    const monthlyIntervalOptions = [
        { value: 1, label: __('Every month', 'stachethemes_event_calendar_lite') },
        { value: 2, label: __('Every other month', 'stachethemes_event_calendar_lite') },
        { value: 3, label: __('Every 3rd month', 'stachethemes_event_calendar_lite') },
        { value: 4, label: __('Every 4th month', 'stachethemes_event_calendar_lite') },
        { value: 5, label: __('Every 5th month', 'stachethemes_event_calendar_lite') },
        { value: 6, label: __('Every 6th month', 'stachethemes_event_calendar_lite') },
        { value: 7, label: __('Every 7th month', 'stachethemes_event_calendar_lite') },
        { value: 8, label: __('Every 8th month', 'stachethemes_event_calendar_lite') },
        { value: 9, label: __('Every 9th month', 'stachethemes_event_calendar_lite') },
        { value: 10, label: __('Every 10th month', 'stachethemes_event_calendar_lite') },
        { value: 11, label: __('Every 11th month', 'stachethemes_event_calendar_lite') },
        { value: 12, label: __('Every 12th month', 'stachethemes_event_calendar_lite') },
        { value: 18, label: __('Every 18th month', 'stachethemes_event_calendar_lite') },
        { value: 24, label: __('Every 24th month', 'stachethemes_event_calendar_lite') },
        { value: 36, label: __('Every 36th month', 'stachethemes_event_calendar_lite') },
        { value: 48, label: __('Every 48th month', 'stachethemes_event_calendar_lite') }
    ];

    const monthlyAndYearlyByDayOptions = [
        { value: "1MO", label: __('1st Monday', 'stachethemes_event_calendar_lite') },
        { value: "1TU", label: __('1st Tuesday', 'stachethemes_event_calendar_lite') },
        { value: "1WE", label: __('1st Wednesday', 'stachethemes_event_calendar_lite') },
        { value: "1TH", label: __('1st Thursday', 'stachethemes_event_calendar_lite') },
        { value: "1FR", label: __('1st Friday', 'stachethemes_event_calendar_lite') },
        { value: "1SA", label: __('1st Saturday', 'stachethemes_event_calendar_lite') },
        { value: "1SU", label: __('1st Sunday', 'stachethemes_event_calendar_lite') },
        { value: "2MO", label: __('2nd Monday', 'stachethemes_event_calendar_lite') },
        { value: "2TU", label: __('2nd Tuesday', 'stachethemes_event_calendar_lite') },
        { value: "2WE", label: __('2nd Wednesday', 'stachethemes_event_calendar_lite') },
        { value: "2TH", label: __('2nd Thursday', 'stachethemes_event_calendar_lite') },
        { value: "2FR", label: __('2nd Friday', 'stachethemes_event_calendar_lite') },
        { value: "2SA", label: __('2nd Saturday', 'stachethemes_event_calendar_lite') },
        { value: "2SU", label: __('2nd Sunday', 'stachethemes_event_calendar_lite') },
        { value: "3MO", label: __('3rd Monday', 'stachethemes_event_calendar_lite') },
        { value: "3TU", label: __('3rd Tuesday', 'stachethemes_event_calendar_lite') },
        { value: "3WE", label: __('3rd Wednesday', 'stachethemes_event_calendar_lite') },
        { value: "3TH", label: __('3rd Thursday', 'stachethemes_event_calendar_lite') },
        { value: "3FR", label: __('3rd Friday', 'stachethemes_event_calendar_lite') },
        { value: "3SA", label: __('3rd Saturday', 'stachethemes_event_calendar_lite') },
        { value: "3SU", label: __('3rd Sunday', 'stachethemes_event_calendar_lite') },
        { value: "4MO", label: __('4th Monday', 'stachethemes_event_calendar_lite') },
        { value: "4TU", label: __('4th Tuesday', 'stachethemes_event_calendar_lite') },
        { value: "4WE", label: __('4th Wednesday', 'stachethemes_event_calendar_lite') },
        { value: "4TH", label: __('4th Thursday', 'stachethemes_event_calendar_lite') },
        { value: "4FR", label: __('4th Friday', 'stachethemes_event_calendar_lite') },
        { value: "4SA", label: __('4th Saturday', 'stachethemes_event_calendar_lite') },
        { value: "4SU", label: __('4th Sunday', 'stachethemes_event_calendar_lite') },
        { value: "5MO", label: __('5th Monday', 'stachethemes_event_calendar_lite') },
        { value: "5TU", label: __('5th Tuesday', 'stachethemes_event_calendar_lite') },
        { value: "5WE", label: __('5th Wednesday', 'stachethemes_event_calendar_lite') },
        { value: "5TH", label: __('5th Thursday', 'stachethemes_event_calendar_lite') },
        { value: "5FR", label: __('5th Friday', 'stachethemes_event_calendar_lite') },
        { value: "5SA", label: __('5th Saturday', 'stachethemes_event_calendar_lite') },
        { value: "5SU", label: __('5th Sunday', 'stachethemes_event_calendar_lite') },
        { value: "-1MO", label: __('Last Monday', 'stachethemes_event_calendar_lite') },
        { value: "-1TU", label: __('Last Tuesday', 'stachethemes_event_calendar_lite') },
        { value: "-1WE", label: __('Last Wednesday', 'stachethemes_event_calendar_lite') },
        { value: "-1TH", label: __('Last Thursday', 'stachethemes_event_calendar_lite') },
        { value: "-1FR", label: __('Last Friday', 'stachethemes_event_calendar_lite') },
        { value: "-1SA", label: __('Last Saturday', 'stachethemes_event_calendar_lite') },
        { value: "-1SU", label: __('Last Sunday', 'stachethemes_event_calendar_lite') }
    ];

    const monthlyAndYearlyByDateOptions = [
        { value: 1, label: __('1st day', 'stachethemes_event_calendar_lite') },
        { value: 2, label: __('2nd day', 'stachethemes_event_calendar_lite') },
        { value: 3, label: __('3rd day', 'stachethemes_event_calendar_lite') },
        { value: 4, label: __('4th day', 'stachethemes_event_calendar_lite') },
        { value: 5, label: __('5th day', 'stachethemes_event_calendar_lite') },
        { value: 6, label: __('6th day', 'stachethemes_event_calendar_lite') },
        { value: 7, label: __('7th day', 'stachethemes_event_calendar_lite') },
        { value: 8, label: __('8th day', 'stachethemes_event_calendar_lite') },
        { value: 9, label: __('9th day', 'stachethemes_event_calendar_lite') },
        { value: 10, label: __('10th day', 'stachethemes_event_calendar_lite') },
        { value: 11, label: __('11th day', 'stachethemes_event_calendar_lite') },
        { value: 12, label: __('12th day', 'stachethemes_event_calendar_lite') },
        { value: 13, label: __('13th day', 'stachethemes_event_calendar_lite') },
        { value: 14, label: __('14th day', 'stachethemes_event_calendar_lite') },
        { value: 15, label: __('15th day', 'stachethemes_event_calendar_lite') },
        { value: 16, label: __('16th day', 'stachethemes_event_calendar_lite') },
        { value: 17, label: __('17th day', 'stachethemes_event_calendar_lite') },
        { value: 18, label: __('18th day', 'stachethemes_event_calendar_lite') },
        { value: 19, label: __('19th day', 'stachethemes_event_calendar_lite') },
        { value: 20, label: __('20th day', 'stachethemes_event_calendar_lite') },
        { value: 21, label: __('21st day', 'stachethemes_event_calendar_lite') },
        { value: 22, label: __('22nd day', 'stachethemes_event_calendar_lite') },
        { value: 23, label: __('23rd day', 'stachethemes_event_calendar_lite') },
        { value: 24, label: __('24th day', 'stachethemes_event_calendar_lite') },
        { value: 25, label: __('25th day', 'stachethemes_event_calendar_lite') },
        { value: 26, label: __('26th day', 'stachethemes_event_calendar_lite') },
        { value: 27, label: __('27th day', 'stachethemes_event_calendar_lite') },
        { value: 28, label: __('28th day', 'stachethemes_event_calendar_lite') },
        { value: 29, label: __('29th day', 'stachethemes_event_calendar_lite') },
        { value: 30, label: __('30th day', 'stachethemes_event_calendar_lite') },
        { value: 31, label: __('31th day', 'stachethemes_event_calendar_lite') },
    ];

    const yearlyIntervalOptions = [
        { value: 1, label: __('Every year', 'stachethemes_event_calendar_lite') },
        { value: 2, label: __('Every other year', 'stachethemes_event_calendar_lite') },
        { value: 3, label: __('Every 3rd year', 'stachethemes_event_calendar_lite') },
        { value: 4, label: __('Every 4th year', 'stachethemes_event_calendar_lite') },
        { value: 5, label: __('Every 5th year', 'stachethemes_event_calendar_lite') },
        { value: 6, label: __('Every 6th year', 'stachethemes_event_calendar_lite') },
        { value: 7, label: __('Every 7th year', 'stachethemes_event_calendar_lite') },
        { value: 8, label: __('Every 8th year', 'stachethemes_event_calendar_lite') },
        { value: 9, label: __('Every 9th year', 'stachethemes_event_calendar_lite') },
        { value: 10, label: __('Every 10th year', 'stachethemes_event_calendar_lite') }
    ];

    const yearlyByMonthOptions = [
        { value: 1, label: __('January', 'stachethemes_event_calendar_lite') },
        { value: 2, label: __('February', 'stachethemes_event_calendar_lite') },
        { value: 3, label: __('March', 'stachethemes_event_calendar_lite') },
        { value: 4, label: __('April', 'stachethemes_event_calendar_lite') },
        { value: 5, label: __('May', 'stachethemes_event_calendar_lite') },
        { value: 6, label: __('June', 'stachethemes_event_calendar_lite') },
        { value: 7, label: __('July', 'stachethemes_event_calendar_lite') },
        { value: 8, label: __('August', 'stachethemes_event_calendar_lite') },
        { value: 9, label: __('September', 'stachethemes_event_calendar_lite') },
        { value: 10, label: __('October', 'stachethemes_event_calendar_lite') },
        { value: 11, label: __('November', 'stachethemes_event_calendar_lite') },
        { value: 12, label: __('December', 'stachethemes_event_calendar_lite') },
    ];

    const maybeDailyInterval = () => {

        if (!manual && rruleSettings.FREQ === 'daily') {

            return <>
                <Spacer />
                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Daily Interval', 'stachethemes_event_calendar_lite')}
                    value={rruleSettings.INTERVAL ? parseInt(rruleSettings.INTERVAL, 10) : ''}
                    options={dailyIntervalOptions}
                    onChange={(newValue) => {
                        const newRRule = { ...rruleSettings, INTERVAL: newValue };
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />
                <Spacer />
            </>
        }

        return '';
    }

    const maybeWeeklyInterval = () => {

        if (!manual && rruleSettings.FREQ === 'weekly') {

            return <>
                <Spacer />
                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Weekly by day', 'stachethemes_event_calendar_lite')}
                    multiple={true}
                    value={rruleSettings.BYDAY ? rruleSettings.BYDAY.split(',') : []}
                    options={weeklyByDayOptions}
                    onChange={(newValue) => {
                        const newRRule = { ...rruleSettings, BYDAY: newValue };
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Weekly interval', 'stachethemes_event_calendar_lite')}
                    value={rruleSettings.INTERVAL ? parseInt(rruleSettings.INTERVAL, 10) : ''}
                    options={weeklyIntervalOptions}
                    onChange={(newValue) => {
                        const newRRule = { ...rruleSettings, INTERVAL: newValue };
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}

                />
                <Spacer />
            </>
        }

        return '';
    }

    const maybeMonthlyInterval = () => {

        if (!manual && rruleSettings.FREQ === 'monthly-by-day') {

            return <>
                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Monthly by day', 'stachethemes_event_calendar_lite')}
                    multiple={true}
                    value={rruleSettings.BYDAY ? rruleSettings.BYDAY.split(',') : []}
                    options={monthlyAndYearlyByDayOptions}
                    onChange={(newValue) => {

                        const newRRule = { ...rruleSettings, BYDAY: newValue };
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);

                    }}
                />

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Monthly interval', 'stachethemes_event_calendar_lite')}
                    value={rruleSettings.INTERVAL ? parseInt(rruleSettings.INTERVAL, 10) : ''}
                    options={monthlyIntervalOptions}
                    onChange={(newValue) => {
                        const newRRule = ({ ...rruleSettings, INTERVAL: newValue });
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />
                <Spacer />
            </>
        }

        if (rruleSettings.FREQ === 'monthly-by-date') {

            return <>

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Monthly by date', 'stachethemes_event_calendar_lite')}
                    multiple={true}
                    value={rruleSettings.BYMONTHDAY ? rruleSettings.BYMONTHDAY.split(',').map(x => {
                        return parseInt(x, 10);
                    }) : []}
                    options={monthlyAndYearlyByDateOptions}
                    onChange={(newValue) => {
                        const newRRule = ({ ...rruleSettings, BYMONTHDAY: newValue });
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);

                    }}
                />

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Monthly interval', 'stachethemes_event_calendar_lite')}
                    value={rruleSettings.INTERVAL ? parseInt(rruleSettings.INTERVAL, 10) : ''}
                    options={monthlyIntervalOptions}
                    onChange={(newValue) => {
                        const newRRule = ({ ...rruleSettings, INTERVAL: newValue });
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />

                <Spacer />
            </>
        }

        return '';
    }

    const maybeYearlyInterval = () => {

        if (!manual && rruleSettings.FREQ === 'yearly-by-day') {

            return <>

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Yearly by day', 'stachethemes_event_calendar_lite')}
                    multiple={true}
                    value={rruleSettings.BYDAY ? rruleSettings.BYDAY.split(',') : []}
                    options={monthlyAndYearlyByDayOptions}
                    onChange={(newValue) => {
                        const newRRule = ({ ...rruleSettings, BYDAY: newValue });
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Yearly by month', 'stachethemes_event_calendar_lite')}
                    multiple={true}
                    value={rruleSettings.BYMONTH ? rruleSettings.BYMONTH.split(',').map(x => {
                        return parseInt(x, 10);
                    }) : []}
                    options={yearlyByMonthOptions}
                    onChange={(newValue) => {
                        const newRRule = ({ ...rruleSettings, BYMONTH: newValue });
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Yearly interval', 'stachethemes_event_calendar_lite')}
                    value={rruleSettings.INTERVAL ? parseInt(rruleSettings.INTERVAL, 10) : ''}
                    options={yearlyIntervalOptions}
                    onChange={(newValue) => {
                        const newRRule = ({ ...rruleSettings, INTERVAL: newValue });
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />

                <Spacer />
            </>
        }

        if (rruleSettings.FREQ === 'yearly-by-date') {

            return <>

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Yearly by date', 'stachethemes_event_calendar_lite')}
                    multiple={true}
                    value={rruleSettings.BYMONTHDAY ? rruleSettings.BYMONTHDAY.split(',').map(x => {
                        return parseInt(x, 10);
                    }) : []}
                    options={monthlyAndYearlyByDateOptions}
                    onChange={(newValue) => {
                        const newRRule = ({ ...rruleSettings, BYMONTHDAY: newValue });
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Yearly by month', 'stachethemes_event_calendar_lite')}
                    multiple={true}
                    value={rruleSettings.BYMONTH ? rruleSettings.BYMONTH.split(',').map(x => {
                        return parseInt(x, 10);
                    }) : []}
                    options={yearlyByMonthOptions}
                    onChange={(newValue) => {
                        const newRRule = ({ ...rruleSettings, BYMONTH: newValue });
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />

                <Spacer />

                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Yearly interval', 'stachethemes_event_calendar_lite')}
                    value={rruleSettings.INTERVAL ? parseInt(rruleSettings.INTERVAL, 10) : ''}
                    options={yearlyIntervalOptions}
                    onChange={(newValue) => {
                        const newRRule = ({ ...rruleSettings, INTERVAL: newValue });
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                />

                <Spacer />
            </>
        }

        return '';
    }

    const maybeUntilOptions = () => {

        if (manual || !rrule) {
            return '';
        }

        const maybeUntilInput = () => {

            if (typeof rruleSettings.UNTIL === 'undefined') {
                return '';
            }

            const year = rruleSettings.UNTIL.substr(0, 4);
            const month = rruleSettings.UNTIL.substr(4, 2);
            const date = rruleSettings.UNTIL.substr(6, 2);

            return <>
                <Spacer />
                <DatePicker
                    value={`${year}-${month}-${date}`}
                    min={min}
                    includeTime={false}
                    onChange={(date) => {
                        const dateInFormat = moment(date).format('YYYYMMDD');
                        const newRRule = { ...rruleSettings, UNTIL: dateInFormat };
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                /></>
        }

        const maybeCountInput = () => {
            if (typeof rruleSettings.COUNT === 'undefined') {
                return '';
            }

            return <>
                <Spacer />
                <InputText
                    value={rruleSettings.COUNT}
                    placeholder={__('Number of occurrences', 'stachethemes_event_calendar_lite')}
                    onChange={(value) => {

                        if (isNaN(value)) {
                            return;
                        }
                        const newRRule = { ...rruleSettings, COUNT: value };
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                    }}
                /></>
        }

        return <>
            <Spacer />
            <InputRadio
                title={__('Repeat forever', 'stachethemes_event_calendar_lite')}
                value={typeof rruleSettings.UNTIL === 'undefined'
                    && typeof rruleSettings.COUNT === 'undefined' ? true : false}
                onChange={() => {
                    const newRRule = { ...rruleSettings };

                    delete newRRule.COUNT;
                    delete newRRule.UNTIL;

                    const rruleString = rruleObjectToString(newRRule);

                    onRRuleChange(rruleString);
                }}
            />

            <InputRadio
                title={__('Until', 'stachethemes_event_calendar_lite')}
                value={typeof rruleSettings.UNTIL !== 'undefined' ? true : false}
                onChange={() => {
                    const newRRule = { ...rruleSettings, UNTIL: '' };

                    delete newRRule.COUNT;

                    const rruleString = rruleObjectToString(newRRule);
                    onRRuleChange(rruleString);
                }}
            />

            <InputRadio
                title={__('Occurrence(s)', 'stachethemes_event_calendar_lite')}
                value={typeof rruleSettings.COUNT !== 'undefined' ? true : false}
                onChange={() => {
                    const newRRule = { ...rruleSettings, COUNT: '' };

                    delete newRRule.UNTIL;

                    const rruleString = rruleObjectToString(newRRule);
                    onRRuleChange(rruleString);
                }}

            />

            {maybeUntilInput()}
            {maybeCountInput()}
        </>
    }

    const maybeRRuleInput = () => {

        if (manual || !rrule) {
            return '';
        }

        return <>
            <Spacer />
            <InputText
                readOnly={true}
                title={__('RRULE', 'stachethemes_event_calendar_lite')}
                value={rrule}
                description={__('Generated RRULE String', 'stachethemes_event_calendar_lite')}
            /></>
    }

    const maybeManulInput = () => {

        if (!manual) {
            return '';
        }

        return <>
            <Spacer />
            <InputText
                title={__('RRULE', 'stachethemes_event_calendar_lite')}
                value={rrule}
                placeholder={__('Enter your custom RRULE string', 'stachethemes_event_calendar_lite')}
                description={__('The recurrence rule (RRULE) is used in computing the recurrence set.', 'stachethemes_event_calendar_lite')}
                onChange={value => {
                    onRRuleChange(value);
                }}
            /></>
    }

    const rruleObjectFromString = (rrule) => {

        let rruleObject = {};
        let rruleArray = rrule.split(';');

        rruleArray.forEach((param) => {
            if (param) {
                const keyValue = param.split('=');
                rruleObject[keyValue[0]] = keyValue[1];
            }
        });

        switch (rruleObject.FREQ) {

            case 'DAILY':
                rruleObject.FREQ = 'daily';
                break;
            case 'WEEKLY':
                rruleObject.FREQ = 'weekly';
                break;
            case 'MONTHLY':
                if (typeof rruleObject.BYMONTHDAY !== 'undefined') {
                    rruleObject.FREQ = 'monthly-by-date';
                } else {
                    rruleObject.FREQ = 'monthly-by-day';
                }
                break;
            case 'YEARLY':
                if (typeof rruleObject.BYMONTHDAY !== 'undefined') {
                    rruleObject.FREQ = 'yearly-by-date';
                } else {
                    rruleObject.FREQ = 'yearly-by-day';
                }
                break;
        }

        return rruleObject;
    }

    const rruleObjectToString = (rruleObject) => {

        const theObject = { ...rruleObject };
        let rrule = '';

        switch (theObject.FREQ) {
            case 'daily':
                theObject.FREQ = 'DAILY';
                break;
            case 'weekly':
                theObject.FREQ = 'WEEKLY';
                break;
            case 'monthly-by-date':
                if (!theObject.BYMONTHDAY) {
                    theObject.BYMONTHDAY = '';
                }
                theObject.FREQ = 'MONTHLY';
                break;
            case 'monthly-by-day':
                theObject.FREQ = 'MONTHLY';
                break;
            case 'yearly-by-date':
                if (!theObject.BYMONTHDAY) {
                    theObject.BYMONTHDAY = '';
                }
                theObject.FREQ = 'YEARLY';
                break;
            case 'yearly-by-day':
                theObject.FREQ = 'YEARLY';
                break;
        }

        Object.keys(theObject).forEach((prop) => {
            if (prop) {
                rrule += `${prop}=${theObject[prop]};`;
            }
        });

        return rrule;
    }

    const rruleSettings = manual ? {} : rruleObjectFromString(rrule);

    return (
        <StecDiv className="stec-rrule-generator">

            <FieldTitle text={title} />

            <InputSelect
                absoluteDropdown={absoluteDropdown}
                value={manual ? 'manual' : (rruleSettings.FREQ ? rruleSettings.FREQ : '')}
                options={repeatOptions}
                onChange={(newValue) => {

                    if (newValue === '') {
                        onModeChange('');
                        onRRuleChange('');
                    } else if ('manual' === newValue) {
                        onRRuleChange('');
                        onModeChange('manual');
                    } else {
                        const newRRule = { FREQ: newValue, INTERVAL: 1 };
                        const rruleString = rruleObjectToString(newRRule);
                        onRRuleChange(rruleString);
                        onModeChange('');
                    }

                }}
            />

            {maybeDailyInterval()}
            {maybeWeeklyInterval()}
            {maybeMonthlyInterval()}
            {maybeYearlyInterval()}
            {maybeUntilOptions()}
            {maybeRRuleInput()}
            {maybeManulInput()}

            <ExdateGenerator
                value={exdate}
                display={(manual || rruleSettings.FREQ) ? true : false}
                onExdateChange={onExdateChange}
            />


            {(!rruleSettings.FREQ && !manual) && <FieldDescription text={description} />}

        </StecDiv>
    )
}

export default RRuleGenerator

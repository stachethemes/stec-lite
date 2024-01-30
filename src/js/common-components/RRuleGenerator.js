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
                    title={__('EXDATE', 'stec')}
                    description={__('Add date exception', 'stec')}
                    onChange={(value) => {
                        setExdate(value);
                    }} />

                <Button className='blue' label={__('Add Exdate', 'stec')} onClick={() => {

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
        { value: '', label: __('Disabled', 'stec') },
        { value: 'daily', label: __('Daily', 'stec') },
        { value: 'weekly', label: __('Weekly', 'stec') },
        { value: 'monthly-by-day', label: __('Monthly by day', 'stec') },
        { value: 'monthly-by-date', label: __('Monthly by date', 'stec') },
        { value: 'yearly-by-day', label: __('Yearly by day', 'stec') },
        { value: 'yearly-by-date', label: __('Yearly by date', 'stec') },
        { value: 'manual', label: __('Manual Mode (Advanced)', 'stec') },
    ];

    const dailyIntervalOptions = [
        { value: 1, label: __('Every day', 'stec') },
        { value: 2, label: __('Every other day', 'stec') },
        { value: 3, label: __('Every 3rd day', 'stec') },
        { value: 4, label: __('Every 4th day', 'stec') },
        { value: 5, label: __('Every 5th day', 'stec') },
        { value: 6, label: __('Every 6th day', 'stec') },
        { value: 7, label: __('Every 7th day', 'stec') },
        { value: 8, label: __('Every 8th day', 'stec') },
        { value: 9, label: __('Every 9th day', 'stec') },
        { value: 10, label: __('Every 10th day', 'stec') },
        { value: 11, label: __('Every 11th day', 'stec') },
        { value: 12, label: __('Every 12th day', 'stec') },
        { value: 13, label: __('Every 13th day', 'stec') },
        { value: 14, label: __('Every 14th day', 'stec') },
        { value: 15, label: __('Every 15th day', 'stec') },
        { value: 16, label: __('Every 16th day', 'stec') },
        { value: 17, label: __('Every 17th day', 'stec') },
        { value: 18, label: __('Every 18th day', 'stec') },
        { value: 19, label: __('Every 19th day', 'stec') },
        { value: 20, label: __('Every 20th day', 'stec') },
        { value: 21, label: __('Every 21st day', 'stec') },
        { value: 22, label: __('Every 22nd day', 'stec') },
        { value: 23, label: __('Every 23rd day', 'stec') },
        { value: 24, label: __('Every 24th day', 'stec') },
        { value: 25, label: __('Every 25th day', 'stec') },
        { value: 26, label: __('Every 26th day', 'stec') },
        { value: 27, label: __('Every 27th day', 'stec') },
        { value: 28, label: __('Every 28th day', 'stec') },
        { value: 29, label: __('Every 29th day', 'stec') },
        { value: 30, label: __('Every 30th day', 'stec') }
    ];

    const weeklyIntervalOptions = [
        { value: 1, label: __('Every week', 'stec') },
        { value: 2, label: __('Every other week', 'stec') },
        { value: 3, label: __('Every 3rd week', 'stec') },
        { value: 4, label: __('Every 4th week', 'stec') },
        { value: 5, label: __('Every 5th week', 'stec') },
        { value: 6, label: __('Every 6th week', 'stec') },
        { value: 7, label: __('Every 7th week', 'stec') },
        { value: 8, label: __('Every 8th week', 'stec') },
        { value: 9, label: __('Every 9th week', 'stec') },
        { value: 10, label: __('Every 10th week', 'stec') },
        { value: 11, label: __('Every 11th week', 'stec') },
        { value: 12, label: __('Every 12th week', 'stec') },
        { value: 13, label: __('Every 13th week', 'stec') },
        { value: 14, label: __('Every 14th week', 'stec') },
        { value: 16, label: __('Every 15th week', 'stec') },
        { value: 17, label: __('Every 16th week', 'stec') },
        { value: 18, label: __('Every 17th week', 'stec') },
        { value: 19, label: __('Every 18th week', 'stec') },
        { value: 20, label: __('Every 19th week', 'stec') },
        { value: 21, label: __('Every 20th week', 'stec') },
        { value: 22, label: __('Every 21st week', 'stec') },
        { value: 23, label: __('Every 22nd week', 'stec') },
        { value: 24, label: __('Every 23rd week', 'stec') },
        { value: 25, label: __('Every 25th week', 'stec') },
        { value: 26, label: __('Every 26th week', 'stec') }
    ];

    const weeklyByDayOptions = [
        { value: "MO", label: __('Monday', 'stec') },
        { value: "TU", label: __('Tuesday', 'stec') },
        { value: "WE", label: __('Wednesday', 'stec') },
        { value: "TH", label: __('Thursday', 'stec') },
        { value: "FR", label: __('Friday', 'stec') },
        { value: "SA", label: __('Saturday', 'stec') },
        { value: "SU", label: __('Sunday', 'stec') }
    ];

    const monthlyIntervalOptions = [
        { value: 1, label: __('Every month', 'stec') },
        { value: 2, label: __('Every other month', 'stec') },
        { value: 3, label: __('Every 3rd month', 'stec') },
        { value: 4, label: __('Every 4th month', 'stec') },
        { value: 5, label: __('Every 5th month', 'stec') },
        { value: 6, label: __('Every 6th month', 'stec') },
        { value: 7, label: __('Every 7th month', 'stec') },
        { value: 8, label: __('Every 8th month', 'stec') },
        { value: 9, label: __('Every 9th month', 'stec') },
        { value: 10, label: __('Every 10th month', 'stec') },
        { value: 11, label: __('Every 11th month', 'stec') },
        { value: 12, label: __('Every 12th month', 'stec') },
        { value: 18, label: __('Every 18th month', 'stec') },
        { value: 24, label: __('Every 24th month', 'stec') },
        { value: 36, label: __('Every 36th month', 'stec') },
        { value: 48, label: __('Every 48th week', 'stec') }
    ];

    const monthlyAndYearlyByDayOptions = [
        { value: "1MO", label: __('1st Monday', 'stec') },
        { value: "1TU", label: __('1st Tuesday', 'stec') },
        { value: "1WE", label: __('1st Wednesday', 'stec') },
        { value: "1TH", label: __('1st Thursday', 'stec') },
        { value: "1FR", label: __('1st Friday', 'stec') },
        { value: "1SA", label: __('1st Saturday', 'stec') },
        { value: "1SU", label: __('1st Sunday', 'stec') },
        { value: "2MO", label: __('2nd Monday', 'stec') },
        { value: "2TU", label: __('2nd Tuesday', 'stec') },
        { value: "2WE", label: __('2nd Wednesday', 'stec') },
        { value: "2TH", label: __('2nd Thursday', 'stec') },
        { value: "2FR", label: __('2nd Friday', 'stec') },
        { value: "2SA", label: __('2nd Saturday', 'stec') },
        { value: "2SU", label: __('2nd Sunday', 'stec') },
        { value: "3MO", label: __('3rd Monday', 'stec') },
        { value: "3TU", label: __('3rd Tuesday', 'stec') },
        { value: "3WE", label: __('3rd Wednesday', 'stec') },
        { value: "3TH", label: __('3rd Thursday', 'stec') },
        { value: "3FR", label: __('3rd Friday', 'stec') },
        { value: "3SA", label: __('3rd Saturday', 'stec') },
        { value: "3SU", label: __('3rd Sunday', 'stec') },
        { value: "4MO", label: __('4th Monday', 'stec') },
        { value: "4TU", label: __('4th Tuesday', 'stec') },
        { value: "4WE", label: __('4th Wednesday', 'stec') },
        { value: "4TH", label: __('4th Thursday', 'stec') },
        { value: "4FR", label: __('4th Friday', 'stec') },
        { value: "4SA", label: __('4th Saturday', 'stec') },
        { value: "4SU", label: __('4th Sunday', 'stec') },
        { value: "5MO", label: __('5th Monday', 'stec') },
        { value: "5TU", label: __('5th Tuesday', 'stec') },
        { value: "5WE", label: __('5th Wednesday', 'stec') },
        { value: "5TH", label: __('5th Thursday', 'stec') },
        { value: "5FR", label: __('5th Friday', 'stec') },
        { value: "5SA", label: __('5th Saturday', 'stec') },
        { value: "5SU", label: __('5th Sunday', 'stec') },
        { value: "-1MO", label: __('Last Monday', 'stec') },
        { value: "-1TU", label: __('Last Tuesday', 'stec') },
        { value: "-1WE", label: __('Last Wednesday', 'stec') },
        { value: "-1TH", label: __('Last Thursday', 'stec') },
        { value: "-1FR", label: __('Last Friday', 'stec') },
        { value: "-1SA", label: __('Last Saturday', 'stec') },
        { value: "-1SU", label: __('Last Sunday', 'stec') }
    ];

    const monthlyAndYearlyByDateOptions = [
        { value: 1, label: __('1st day', 'stec') },
        { value: 2, label: __('2nd day', 'stec') },
        { value: 3, label: __('3rd day', 'stec') },
        { value: 4, label: __('4th day', 'stec') },
        { value: 5, label: __('5th day', 'stec') },
        { value: 6, label: __('6th day', 'stec') },
        { value: 7, label: __('7th day', 'stec') },
        { value: 8, label: __('8th day', 'stec') },
        { value: 9, label: __('9th day', 'stec') },
        { value: 10, label: __('10th day', 'stec') },
        { value: 11, label: __('11th day', 'stec') },
        { value: 12, label: __('12th day', 'stec') },
        { value: 13, label: __('13th day', 'stec') },
        { value: 14, label: __('14th day', 'stec') },
        { value: 15, label: __('15th day', 'stec') },
        { value: 16, label: __('16th day', 'stec') },
        { value: 17, label: __('17th day', 'stec') },
        { value: 18, label: __('18th day', 'stec') },
        { value: 19, label: __('19th day', 'stec') },
        { value: 20, label: __('20th day', 'stec') },
        { value: 21, label: __('21st day', 'stec') },
        { value: 22, label: __('22nd day', 'stec') },
        { value: 23, label: __('23rd day', 'stec') },
        { value: 24, label: __('24th day', 'stec') },
        { value: 25, label: __('25th day', 'stec') },
        { value: 26, label: __('26th day', 'stec') },
        { value: 27, label: __('27th day', 'stec') },
        { value: 28, label: __('28th day', 'stec') },
        { value: 29, label: __('29th day', 'stec') },
        { value: 30, label: __('30th day', 'stec') },
        { value: 31, label: __('31th day', 'stec') },
    ];

    const yearlyIntervalOptions = [
        { value: 1, label: __('Every year', 'stec') },
        { value: 2, label: __('Every other year', 'stec') },
        { value: 3, label: __('Every 3rd year', 'stec') },
        { value: 4, label: __('Every 4th year', 'stec') },
        { value: 5, label: __('Every 5th year', 'stec') },
        { value: 6, label: __('Every 6th year', 'stec') },
        { value: 7, label: __('Every 7th year', 'stec') },
        { value: 8, label: __('Every 8th year', 'stec') },
        { value: 9, label: __('Every 9th year', 'stec') },
        { value: 10, label: __('Every 10th year', 'stec') }
    ];

    const yearlyByMonthOptions = [
        { value: 1, label: __('January', 'stec') },
        { value: 2, label: __('February', 'stec') },
        { value: 3, label: __('March', 'stec') },
        { value: 4, label: __('April', 'stec') },
        { value: 5, label: __('May', 'stec') },
        { value: 6, label: __('June', 'stec') },
        { value: 7, label: __('July', 'stec') },
        { value: 8, label: __('August', 'stec') },
        { value: 9, label: __('September', 'stec') },
        { value: 10, label: __('October', 'stec') },
        { value: 11, label: __('November', 'stec') },
        { value: 12, label: __('December', 'stec') },
    ];

    const maybeDailyInterval = () => {

        if (!manual && rruleSettings.FREQ === 'daily') {

            return <>
                <Spacer />
                <InputSelect
                    absoluteDropdown={absoluteDropdown}
                    title={__('Daily Interval', 'stec')}
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
                    title={__('Weekly by day', 'stec')}
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
                    title={__('Weekly interval', 'stec')}
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
                    title={__('Monthly by day', 'stec')}
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
                    title={__('Monthly interval', 'stec')}
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
                    title={__('Monthly by date', 'stec')}
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
                    title={__('Monthly interval', 'stec')}
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
                    title={__('Yearly by day', 'stec')}
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
                    title={__('Yearly by month', 'stec')}
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
                    title={__('Yearly interval', 'stec')}
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
                    title={__('Yearly by date', 'stec')}
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
                    title={__('Yearly by month', 'stec')}
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
                    title={__('Yearly interval', 'stec')}
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
                    placeholder={__('Number of occurrences', 'stec')}
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
                title={__('Repeat forever', 'stec')}
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
                title={__('Until', 'stec')}
                value={typeof rruleSettings.UNTIL !== 'undefined' ? true : false}
                onChange={() => {
                    const newRRule = { ...rruleSettings, UNTIL: '' };

                    delete newRRule.COUNT;

                    const rruleString = rruleObjectToString(newRRule);
                    onRRuleChange(rruleString);
                }}
            />

            <InputRadio
                title={__('Occurrence(s)', 'stec')}
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
                title={__('RRULE')}
                value={rrule}
                description={__('Generated RRULE String', 'stec')}
            /></>
    }

    const maybeManulInput = () => {

        if (!manual) {
            return '';
        }

        return <>
            <Spacer />
            <InputText
                title={__('RRULE')}
                value={rrule}
                placeholder={__('Enter your custom RRULE string', 'stec')}
                description={__('The recurrence rule (RRULE) is used in computing the recurrence set.', 'stec')}
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

import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useState } from 'react';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import InvalidField from './InvalidField';

export const UncontrolledDatePicker = React.forwardRef((props, ref) => {

    const [currentValue, setCurrentValue] = useState(props.defaultValue);

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);


    const dateTimeValue = currentValue.split('T');
    const dateValue = dateTimeValue[0];
    const timeValue = dateTimeValue[1] || '00:00';

    useEffect(() => {

        if ((touched || props.wasSubmitted) && props.required) {

            const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2})?/;
            const validator = new RegExp(regex);
            const isInputValid = validator.test(currentValue);

            setDisplayErrorMessage(false === isInputValid);

            // check if date is in range
            if (isInputValid) {

                const inputMoment = moment(currentValue);
                const minMoment = props.min ? moment(props.min) : false;
                const maxMoment = props.max ? moment(props.max) : false;

                if (minMoment && inputMoment.isBefore(minMoment)) {
                    setDisplayErrorMessage(true);
                }

                if (maxMoment && inputMoment.isAfter(maxMoment)) {
                    setDisplayErrorMessage(true);
                }

            }

        }

    }, [props.required, currentValue, props.wasSubmitted, touched, props.min, props.max]);

    const onChange = (newValue) => {

        if (false === moment(newValue).isValid()) {

            let defaultMoment = props.min ? moment(props.min) : moment();

            const format = props.includeTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';

            newValue = defaultMoment.format(format);
        }

        setCurrentValue(newValue);

        props.onChange(newValue);

    }

    return (
        <StecDiv className='stec-datepicker'>

            <FieldTitle text={props.title} />


            <StecDiv className={props.includeTime ? 'stec-datepicker-inputs' : ''}>

                <input className='stec-datepicker-inputs-date' ref={ref} type="date" value={dateValue} onChange={e => {
                    const newDateTime = e.target.value + 'T' + timeValue;
                    onChange(newDateTime);
                }} min={props.min} max={props.max} onBlur={() => {
                    setTouched(true);
                }} />

                {
                    props.includeTime &&
                    <input type='time'
                        className='stec-datepicker-inputs-time'
                        value={timeValue}
                        onBlur={() => {
                            setTouched(true);
                        }}
                        onChange={e => {
                            const newDateTime = dateValue + 'T' + e.target.value;
                            onChange(newDateTime);
                        }}
                    />

                }
            </StecDiv>

            <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

            <FieldDescription text={props.description} />


        </StecDiv>
    )
});

UncontrolledDatePicker.displayName = 'UncontrolledDatePicker';

export const DatePicker = React.forwardRef((props, ref) => {

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    useEffect(() => {

        if ((touched || props.wasSubmitted) && props.required) {

            const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2})?/;
            const validator = new RegExp(regex);
            const isInputValid = validator.test(props.value);

            setDisplayErrorMessage(false === isInputValid);

            // check if date is in range
            if (isInputValid) {

                const inputMoment = moment(props.value);
                const minMoment = props.min ? moment(props.min) : false;
                const maxMoment = props.max ? moment(props.max) : false;

                if (minMoment && inputMoment.isBefore(minMoment)) {
                    setDisplayErrorMessage(true);
                }

                if (maxMoment && inputMoment.isAfter(maxMoment)) {
                    setDisplayErrorMessage(true);
                }

            }

        }

    }, [props.max, props.min, props.required, props.value, props.wasSubmitted, touched]);

    const onChange = (newValue) => {

        if (false === moment(newValue).isValid()) {

            let defaultMoment = props.min ? moment(props.min) : moment();

            const format = props.includeTime ? 'YYYY-MM-DD\\THH:mm' : 'YYYY-MM-DD';

            newValue = defaultMoment.format(format);
        }

        props.onChange(newValue);

    }

    const dateTimeValue = props.value.split('T');
    const dateValue = dateTimeValue[0];
    const timeValue = dateTimeValue[1] || '00:00';

    return (
        <StecDiv className='stec-datepicker'>

            <FieldTitle text={props.title} />

            <StecDiv className={props.includeTime ? 'stec-datepicker-inputs' : ''}>
                <input ref={ref} className='stec-datepicker-inputs-date' type="date" value={dateValue} onChange={e => {
                    const newDateTime = e.target.value + 'T' + timeValue;
                    onChange(newDateTime);
                }} min={props.min} max={props.max} onBlur={() => {
                    setTouched(true);
                }} />
                {
                    props.includeTime &&

                    <input type='time'
                        className='stec-datepicker-inputs-time'
                        value={timeValue}
                        onBlur={() => {
                            setTouched(true);
                        }}
                        onChange={e => {
                            const newDateTime = dateValue + 'T' + e.target.value;
                            onChange(newDateTime);
                        }}
                    />

                }
            </StecDiv>

            <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

            <FieldDescription text={props.description} />

        </StecDiv>
    )
});

DatePicker.displayName = 'DatePicker';

export default DatePicker

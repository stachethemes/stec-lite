import { StecDiv } from '@Stec/WebComponents';
import FieldDescription from './FieldDescription';
import InvalidField from './InvalidField';
import FieldTitle from './FieldTitle';
import { useState, useEffect } from 'react';

export const UncontrolledDatePicker = React.forwardRef((props, ref) => {

    const [currentValue, setCurrentValue] = useState(props.defaultValue);

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

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

    const onChange = (e) => {

        let newValue = e.target.value;

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

            {props.includeTime ?
                <input ref={ref} type="datetime-local" value={currentValue} onChange={onChange} min={props.min} max={props.max} onBlur={() => {
                    setTouched(true);
                }} /> :
                <input ref={ref} type="date" value={currentValue} onChange={onChange} min={props.min} max={props.max} onBlur={() => {
                    setTouched(true);
                }} />}

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

    const onChange = (e) => {

        let newValue = e.target.value;

        if (false === moment(newValue).isValid()) {

            let defaultMoment = props.min ? moment(props.min) : moment();

            const format = props.includeTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';

            newValue = defaultMoment.format(format);
        }

        props.onChange(newValue);

    }

    return (
        <StecDiv className='stec-datepicker'>

            <FieldTitle text={props.title} />

            {props.includeTime ?
                <input ref={ref} type="datetime-local" value={props.value} onChange={onChange} min={props.min} max={props.max} onBlur={() => {
                    setTouched(true);
                }} /> :
                <input ref={ref} type="date" value={props.value} onChange={onChange} min={props.min} max={props.max} onBlur={() => {
                    setTouched(true);
                }} />}

            <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

            <FieldDescription text={props.description} />


        </StecDiv>
    )
});


DatePicker.displayName = 'DatePicker';

export default DatePicker

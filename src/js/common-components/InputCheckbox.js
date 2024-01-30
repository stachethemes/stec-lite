import { StecDiv, StecInputCheckBox } from '@Stec/WebComponents';
import { useEffect, useState } from 'react';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import InvalidField from './InvalidField';

export const UncontrolledInputCheckbox = (props) => {

    const [currentValue, setCurrentValue] = useState(typeof props.defaultValue !== 'undefined' ? props.defaultValue : false);
    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    useEffect(() => {

        if (touched || props.wasSubmitted) {
            setDisplayErrorMessage(true === props.required && false === currentValue);
        }

    }, [currentValue, props.required, props.wasSubmitted, touched]);

    return (
        <StecDiv className='stec-checkbox-wrapper' title={props.hint}>
            <label>
                <StecInputCheckBox checked={currentValue} onChange={(e) => {
                    setTouched(true);
                    setCurrentValue(e.target.checked);

                    if (props.onChange) {
                        props.onChange(e.target.checked);
                    }
                }} />
                {/* <input type="checkbox" checked={props.value} onChange={props.onChange} /> */}
                <FieldTitle text={props.title} />
            </label>

            <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

            <FieldDescription text={props.description} />

            {props.name && <input type="hidden" required={props.required} name={props.name} value={currentValue} />}
        </StecDiv >
    )
}

export const InputCheckbox = (props) => {

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    useEffect(() => {

        if (touched || props.wasSubmitted) {

            setDisplayErrorMessage(true === props.required && false === props.value);
        }

    }, [props.value, props.required, touched, props.wasSubmitted]);

    return (
        <StecDiv className='stec-checkbox-wrapper' title={props.hint}>
            <label>
                <StecInputCheckBox checked={props.value} onChange={(e) => {
                    setTouched(true);
                    if (props.onChange) {
                        props.onChange(e.target.checked);
                    }
                }} />
                {/* <input type="checkbox" checked={props.value} onChange={props.onChange} /> */}
                <FieldTitle text={props.title} />
            </label>

            <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

            <FieldDescription text={props.description} />

            {props.name && <input type="hidden" required={props.required} name={props.name} value={props.value} />}

        </StecDiv >
    )
}

export default InputCheckbox

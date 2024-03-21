import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useState } from 'react';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import Flexbox from './Flexbox';
import InvalidField from './InvalidField';

export const UncontrolledDelayedInputText = React.forwardRef((props, ref) => {

    const [currentValue, setCurrentValue] = useState(props.defaultValue || '');
    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
    const onChange = props.onChange;
    const minLength = typeof props.minLength !== 'undefined' ? props.minLength : 2;

    useEffect(() => {

        let t;

        t = setTimeout(() => {

            if (onChange && props.defaultValue !== currentValue) {

                if (currentValue.length === 0 || currentValue.length > minLength) {
                    onChange(currentValue);
                }


            }

        }, props.delay || 750);

        if ((touched || props.wasSubmitted) && props.regex) {

            const validator = new RegExp(props.regex);
            const isInputValid = validator.test(currentValue);

            setDisplayErrorMessage(false === isInputValid);

        }

        return () => {
            clearTimeout(t);
        }

    }, [currentValue, props.delay, onChange, props.regex, props.wasSubmitted, touched, props.defaultValue, minLength]);

    const classNameArray = ['stec-input-text-wrapper'];

    if (props.className) {
        classNameArray.push(props.className);
    }

    return (
        <StecDiv className={classNameArray.join(' ')}>

            <label>

                <FieldTitle text={props.title} />

                <input
                    ref={ref}
                    readOnly={props.readOnly}
                    name={props.name}
                    type={props.type || 'text'}
                    required={props.required}
                    value={currentValue}
                    placeholder={props.placeholder}
                    onBlur={() => setTouched(true)}
                    onChange={(e) => {

                        const value = e.target.value;

                        setCurrentValue(value);

                    }}
                    onKeyDown={(e) => {
                        if (props.onKeyPress) {
                            props.onKeyPress(e);
                        }
                    }}
                />

                <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

                <FieldDescription text={props.description} />

            </label>

        </StecDiv>
    )
});

UncontrolledDelayedInputText.displayName = 'UncontrolledDelayedInputText';

export const UncontrolledInputText = React.forwardRef((props, ref) => {

    const [currentValue, setCurrentValue] = useState(props.defaultValue || '');
    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    useEffect(() => {

        if ((touched || props.wasSubmitted) && props.regex) {

            const validator = new RegExp(props.regex);
            const isInputValid = validator.test(currentValue);

            setDisplayErrorMessage(false === isInputValid);

        }

    }, [currentValue, props.regex, props.wasSubmitted, touched]);

    const classNameArray = ['stec-input-text-wrapper'];

    if (props.className) {
        classNameArray.push(props.className);
    }

    return (
        <StecDiv className={classNameArray.join(' ')}>

            <label>

                <Flexbox style={{
                    justifyContent: 'space-between'
                }}>
                    <FieldTitle text={props.title} />

                </Flexbox>

                <input
                    ref={ref}
                    readOnly={props.readOnly}
                    name={props.name}
                    type={props.type || 'text'}
                    required={props.required}
                    value={currentValue}
                    placeholder={props.placeholder}
                    onBlur={() => setTouched(true)}
                    onKeyDown={(e) => {
                        if (props.onKeyPress) {
                            props.onKeyPress(e);
                        }
                    }}
                    onChange={(e) => {
                        setCurrentValue(e.target.value);

                        if (props.onChange) {
                            props.onChange(e.target.value);
                        }
                    }}
                />

                <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

                <FieldDescription text={props.description} />

            </label>

        </StecDiv>
    )
});

UncontrolledInputText.displayName = 'UncontrolledInputText';

export const InputText = React.forwardRef((props, ref) => {

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    useEffect(() => {

        if ((touched || props.wasSubmitted) && props.regex) {

            const validator = new RegExp(props.regex);
            const isInputValid = validator.test(props.value);

            setDisplayErrorMessage(false === isInputValid);

        }

    }, [props.regex, props.value, props.wasSubmitted, touched]);

    const classNameArray = ['stec-input-text-wrapper'];

    if (props.className) {
        classNameArray.push(props.className);
    }

    return (

        <StecDiv className={classNameArray.join(' ')}>

            <label>

                <Flexbox style={{
                    justifyContent: 'space-between'
                }}>

                    <FieldTitle text={props.title} />

                </Flexbox>

                <input
                    ref={ref}
                    readOnly={props.readOnly}
                    name={props.name}
                    type={props.type || 'text'}
                    required={props.required}
                    value={props.value}
                    placeholder={props.placeholder}
                    onBlur={() => setTouched(true)}
                    onChange={(e) => {
                        props.onChange(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (props.onKeyPress) {
                            props.onKeyPress(e);
                        }
                    }}
                />

                <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

                <FieldDescription text={props.description} />

            </label>

        </StecDiv>
    )
});

InputText.displayName = 'InputText';

export default InputText;

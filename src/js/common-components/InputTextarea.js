import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useState } from 'react';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import Flexbox from './Flexbox';
import InvalidField from './InvalidField';

export const UncontrolledInputTextarea = (props) => {

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

    return (
        <StecDiv className='stec-input-textarea-wrapper'>
            <label>
                <Flexbox style={{
                    justifyContent: 'space-between'
                }}>
                    <FieldTitle text={props.title} />

                </Flexbox>

                <textarea
                    style={props.inputStyle}
                    onBlur={() => {
                        setTouched(true);
                    }}
                    type="text"
                    name={props.name}
                    placeholder={props.placeholder}
                    onChange={(e) => {

                        setCurrentValue(e.target.value);

                        if (props.onChange) {
                            props.onChange(e.target.value);
                        }
                    }}
                    value={currentValue}
                ></textarea>

                <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

                <FieldDescription text={props.description} />
            </label>
        </StecDiv>
    )
}

export const InputTextarea = (props) => {

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    useEffect(() => {

        if ((touched || props.wasSubmitted) && props.regex) {

            const validator = new RegExp(props.regex);
            const isInputValid = validator.test(props.value);

            setDisplayErrorMessage(false === isInputValid);

        }

    }, [props.value, props.regex, props.wasSubmitted, touched]);


    return (
        <StecDiv className='stec-input-textarea-wrapper'>
            <label>
                <Flexbox style={{
                    justifyContent: 'space-between'
                }}>
                    <FieldTitle text={props.title} />
                </Flexbox>
                <textarea
                    style={props.inputStyle}
                    onBlur={() => {
                        setTouched(true);
                    }}
                    type="text"
                    name={props.name}
                    placeholder={props.placeholder}
                    onChange={(e) => {
                        props.onChange(e.target.value);
                    }}
                    value={props.value}
                ></textarea>

                <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

                <FieldDescription text={props.description} />
            </label>
        </StecDiv>
    )


}
export default InputTextarea
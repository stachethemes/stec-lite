import { ChromePicker } from 'react-color';
import { useState, useRef } from 'react';
import { useOutsideHandler } from '@Stec/JS/hooks';
import FieldTitle from './FieldTitle';
import FieldDescription from './FieldDescription';
import { StecDiv } from '@Stec/WebComponents';

export const UncontrolledInputColor = (props) => {

    const [isActive, setActive] = useState(false);
    const classNameArray = ['stec-input-color-wrapper'];
    const [currentValue, setCurrentValue] = useState(props.defaultValue || '');
    const inputColorRef = useRef(null);

    useOutsideHandler(inputColorRef, () => {
        setActive(false);
    });

    if (true === isActive) {
        classNameArray.push('active');
    }

    return (
        <StecDiv className={classNameArray.join(' ')} ref={inputColorRef}>
            <FieldTitle text={props.title} />

            <label>
                <StecDiv
                    style={{ backgroundColor: `${currentValue}` }}
                    onClick={() => {
                        setActive(!isActive)
                    }}
                />

                <FieldDescription text={props.description} />
            </label>

            <StecDiv className='stec-input-color-picker'>
                <ChromePicker disableAlpha color={currentValue} onChange={({ hex }) => {

                    setCurrentValue(hex);

                    if (props.onChange) {
                        props.onChange(hex);
                    }

                }} />
            </StecDiv>

            {props.name && <input type="hidden" name={props.name} value={currentValue} />}

        </StecDiv>
    )
}

export const InputColor = (props) => {

    const [isActive, setActive] = useState(false);
    const classNameArray = ['stec-input-color-wrapper'];
    const inputColorRef = useRef(null);

    useOutsideHandler(inputColorRef, () => {
        setActive(false);
    });

    if (true === isActive) {
        classNameArray.push('active');
    }

    return (
        <StecDiv className={classNameArray.join(' ')} ref={inputColorRef}>
            <FieldTitle text={props.title} />

            <label>
                <StecDiv
                    style={{ backgroundColor: `${props.value}` }}
                    onClick={() => {
                        setActive(!isActive)
                    }}
                />

                <FieldDescription text={props.description} />
            </label>

            <StecDiv className='stec-input-color-picker'>
                <ChromePicker disableAlpha color={props.value} onChange={({ hex }) => {
                    props.onChange(hex);
                }} />
            </StecDiv>

        </StecDiv>
    )
}

export default InputColor;
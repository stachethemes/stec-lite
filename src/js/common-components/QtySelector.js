import { StecDiv } from '@Stec/WebComponents';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import { useState } from 'react';

export const UncontrolledQtySelector = (props) => {

    const [currentValue, setCurrentValue] = useState(props.defaultValue);

    const maybeUpdateValue = (newValue) => {

        if (currentValue !== newValue) {
            setCurrentValue(newValue);

            if (props.onChange) {
                props.onChange(newValue);
            }
        }
    }

    return (
        <>
            {props.title && <FieldTitle text={props.title} />}
            <StecDiv className='stec-qty-selector' style={props.style}>
                {currentValue > props.min && <i className='fas fa-minus' onClick={() => {
                    const newValue = Math.max(props.min, currentValue - 1);
                    maybeUpdateValue(newValue);
                }} />}
                <input inputMode='number' type='text' onChange={e => {
                    const newValue = Math.min(props.max, parseInt(e.target.value, 10) || props.min);
                    maybeUpdateValue(newValue);
                }} value={Math.min(props.max, currentValue)} />
                {props.max > currentValue && <i className='fas fa-plus' onClick={() => {
                    const newValue = Math.min(props.max, currentValue + 1);
                    maybeUpdateValue(newValue);
                }} />}
            </StecDiv>
            <FieldDescription text={props.description} />
            {props.name && <input type="hidden" name={props.name} value={currentValue} />}
        </>
    )
}

const QtySelector = (props) => {

    const maybeUpdateValue = (newValue) => {
        if (props.value !== newValue) {
            props.onChange(newValue);
        }
    }

    return (
        <>
            {props.title && <FieldTitle text={props.title} />}
            <StecDiv className='stec-qty-selector' style={props.style}>
                {props.value > props.min && <i className='fas fa-minus' onClick={() => {
                    const newValue = Math.max(props.min, props.value - 1);
                    maybeUpdateValue(newValue);
                }} />}
                <input inputMode='number' type='text' onChange={e => {
                    const newValue = Math.min(props.max, parseInt(e.target.value, 10) || props.min);
                    maybeUpdateValue(newValue);
                }} value={Math.min(props.max, props.value)} />
                {props.max > props.value && <i className='fas fa-plus' onClick={() => {
                    const newValue = Math.min(props.max, props.value + 1);
                    maybeUpdateValue(newValue);
                }} />}
            </StecDiv>
            <FieldDescription text={props.description} />
            {props.name && <input type="hidden" name={props.name} value={props.value} />}
        </>
    )
}

export default QtySelector

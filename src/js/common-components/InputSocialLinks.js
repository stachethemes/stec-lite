import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import Button from './Button';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import IconPicker from './IconPicker';
import { InputText } from './InputText';

export const UncontrolledInputSocialLinks = (props) => {

    const [currentValue, setCurrentValue] = useState(props.defaultLinks);

    const onIconPick = (icon, index) => {

        const newState = cloneDeep(currentValue);

        newState[index].icon = icon;

        setCurrentValue(newState);

        if (props.onChange) {
            props.onChange(newState);
        }
    };

    const onInputChange = (text, index) => {

        const newState = cloneDeep(currentValue);

        newState[index].url = text;

        setCurrentValue(newState);

        if (props.onChange) {
            props.onChange(newState);
        }

    };

    const onAdd = () => {

        const newState = cloneDeep(currentValue);

        newState.push({
            'icon': '',
            'url': ''
        });

        setCurrentValue(newState);

        if (props.onChange) {
            props.onChange(newState);
        }
    };

    const onRemove = (index) => {

        const cloneState = cloneDeep(currentValue);

        const newState = cloneState.filter((item, itemIndex) => {
            return itemIndex !== index
        });

        setCurrentValue(newState);

        if (props.onChange) {
            props.onChange(newState);
        }
    };

    return (
        <StecDiv className='stec-input-social-links'>
            <FieldTitle text={props.title} />

            {currentValue.map((link, i) => {

                return <StecDiv key={i} className='stec-input-social-link-item'>

                    <IconPicker
                        value={link.icon}
                        onPick={(icon) => {
                            onIconPick(icon, i);
                        }}
                    />

                    <InputText
                        value={link.url}
                        placeholder={__('Social link URL', 'stec')}
                        onChange={(value) => {
                            onInputChange(value, i);
                        }}
                    />

                    <StecSpan className='stec-input-social-link-item-remove'
                        onClick={() => {
                            onRemove(i);
                        }}>
                        <i className='fa-solid fa-times' />
                    </StecSpan>

                </StecDiv>
            })}

            <Button className='blue' label={__('Add social link', 'stec')} onClick={onAdd} />

            <FieldDescription text={props.description} />
        </StecDiv>
    )
}

export const InputSocialLinks = (props) => {

    const currentValue = props.value;

    const onIconPick = (icon, index) => {

        const newState = cloneDeep(currentValue);

        newState[index].icon = icon;

        props.onChange(newState);
    };

    const onInputChange = (text, index) => {

        const newState = cloneDeep(currentValue);

        newState[index].url = text;

        props.onChange(newState);

    };

    const onAdd = () => {

        const newState = cloneDeep(currentValue);

        newState.push({
            'icon': '',
            'url': ''
        });

        props.onChange(newState);
    };

    const onRemove = (index) => {

        const cloneState = cloneDeep(currentValue);

        const newState = cloneState.filter((item, itemIndex) => {
            return itemIndex !== index
        });

        props.onChange(newState);
    };

    return (
        <StecDiv className='stec-input-social-links'>
            <FieldTitle text={props.title} />

            {props.links.map((link, i) => {
                return <StecDiv key={i} className='stec-input-social-link-item'>
                    <IconPicker
                        value={link.icon}
                        onPick={(icon) => {
                            onIconPick(icon, i);
                        }}
                    />
                    <InputText
                        value={link.url}
                        placeholder={__('Social link URL', 'stec')}
                        onChange={(value) => {
                            onInputChange(value, i);
                        }}
                    />

                    <StecSpan className='stec-input-social-link-item-remove'
                        onClick={() => {
                            onRemove(i);
                        }}>
                        <i className='fa-solid fa-times' />
                    </StecSpan>

                </StecDiv>
            })}

            <Button className='blue' label={__('Add social link', 'stec')} onClick={onAdd} />

            <FieldDescription text={props.description} />
        </StecDiv>
    )
}

export default InputSocialLinks

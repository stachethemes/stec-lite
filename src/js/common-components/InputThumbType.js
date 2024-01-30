import { StecDiv } from '@Stec/WebComponents';
import IconPicker from './IconPicker';
import InputImages from './InputImages';
import { InputSelect } from './InputSelect';
import Spacer from './Spacer';
import { useState } from 'react';
import { __ } from '@wordpress/i18n';

export const UncontrolledInputThumbType = (props) => {

    const [currentValue, setCurrentValue] = useState(props.defaultValue || {
        type: 'icon',
        icon: '',
        image: []
    });

    const updateCurrentValue = (value) => {

        setCurrentValue(value);

        if (props.onChange) {
            props.onChange(value);
        }
    }

    let displaySettings = '';

    switch (currentValue.type) {
        case 'icon':
            displaySettings = <IconPicker
                title={__('Select icon', 'stec')}
                value={currentValue.icon || ''}
                description={__('Select icon for your thumbnail', 'stec')}
                onPick={(icon) => {
                    updateCurrentValue({ ...currentValue, icon: icon });
                }}
            />
            break;

        case 'date':
            break;

        case 'image':

            displaySettings = <InputImages
                multiple={false}
                value={currentValue.image || []}
                buttonTitle={__('Select image', 'stec')}
                description={__('Select image for your thumbnail', 'stec')}
                onChange={(images) => {
                    updateCurrentValue({ ...currentValue, image: images });
                }}
            />
            break;
    }

    return (
        <StecDiv className='stec-input-thumb-type'>

            <InputSelect
                title={props.title}
                description={props.description}
                options={[
                    { value: 'icon', label: __('Icon', 'stec') },
                    { value: 'date', label: __('Date', 'stec') },
                    { value: 'image', label: __('Image', 'stec') },
                ]}

                value={currentValue.type ? currentValue.type : 'icon'}

                onChange={(newValue) => {
                    updateCurrentValue({ ...currentValue, type: newValue });
                }}
            />

            <Spacer />

            {displaySettings}

            {props.name && <input type='hidden' name={props.name} value={JSON.stringify(currentValue)} />}

        </StecDiv>
    )
}

export const InputThumbType = (props) => {

    const updateCurrentValue = (value) => {
        props.onChange(value);
    }

    let displaySettings = '';

    switch (props.value.type) {
        case 'icon':
            displaySettings = <IconPicker
                title={__('Select icon', 'stec')}
                value={props.value.icon || ''}
                description={__('Select icon for your thumbnail', 'stec')}
                onPick={(icon) => {
                    updateCurrentValue({ ...props.value, icon: icon });
                }}
            />
            break;

        case 'date':
            break;

        case 'image':

            displaySettings = <InputImages
                multiple={false}
                value={props.value.image || []}
                buttonTitle={__('Select image', 'stec')}
                description={__('Select image for your thumbnail', 'stec')}
                onChange={(images) => {
                    updateCurrentValue({ ...props.value, image: images });
                }}

                onRemove={() => {
                    updateCurrentValue({ ...props.value, image: [] });
                }}
            />
            break;
    }

    return (
        <StecDiv className='stec-input-thumb-type'>

            <InputSelect

                title={props.title}
                description={props.description}
                options={[
                    { value: 'icon', label: __('Icon', 'stec') },
                    { value: 'date', label: __('Date', 'stec') },
                    { value: 'image', label: __('Image', 'stec') },
                ]}

                defaultValue={props.value.type ? props.value.type : 'icon'}

                onChange={(newValue) => {
                    updateCurrentValue({ ...props.value, type: newValue });
                }}
            />

            <Spacer />

            {displaySettings}

        </StecDiv>
    )
}

export default InputThumbType

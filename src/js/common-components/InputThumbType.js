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
                title={__('Select icon', 'stachethemes_event_calendar_lite')}
                value={currentValue.icon || ''}
                description={__('Select icon for your thumbnail. Type * to list all icons.', 'stachethemes_event_calendar_lite')}
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
                buttonTitle={__('Select image', 'stachethemes_event_calendar_lite')}
                description={__('Select image for your thumbnail', 'stachethemes_event_calendar_lite')}
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
                    { value: 'icon', label: __('Icon', 'stachethemes_event_calendar_lite') },
                    { value: 'date', label: __('Date', 'stachethemes_event_calendar_lite') },
                    { value: 'image', label: __('Image', 'stachethemes_event_calendar_lite') },
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
                title={__('Select icon', 'stachethemes_event_calendar_lite')}
                value={props.value.icon || ''}
                description={__('Select icon for your thumbnail. Type * to list all icons.', 'stachethemes_event_calendar_lite')}
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
                buttonTitle={__('Select image', 'stachethemes_event_calendar_lite')}
                description={__('Select image for your thumbnail', 'stachethemes_event_calendar_lite')}
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
                    { value: 'icon', label: __('Icon', 'stachethemes_event_calendar_lite') },
                    { value: 'date', label: __('Date', 'stachethemes_event_calendar_lite') },
                    { value: 'image', label: __('Image', 'stachethemes_event_calendar_lite') },
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

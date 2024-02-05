import { useOutsideHandler } from '@Stec/JS/hooks';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import InvalidField from './InvalidField';
const { useState, useRef, useEffect } = wp.element;
import { __ } from '@wordpress/i18n';

export const InputSelect = React.forwardRef((props, ref) => {

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
    const [active, setActive] = useState(false);
    const [search, setSearch] = useState(false);
    const classNameArray = ['stec-select-wrapper'];
    const selectorRef = useRef(null);
    const filteredOptions = props.options.filter((opt) => {

        if (!search) {
            return opt;
        }

        if (opt.search) {

            if (opt.search.toLowerCase().includes(search.toLowerCase())) {
                return opt;
            }

        } else {

            if (opt.label.toLowerCase().includes(search.toLowerCase())) {
                return opt;
            }

        }

        return null;
    });

    const updateCurrentValue = (value) => {

        props.onChange(value);
    }

    let hasDropDownOptions = true;

    if (active) {
        classNameArray.push('active');
    }

    if (props.multiple) {
        classNameArray.push('multiple');
        if (props.value.length === props.options.length) {
            hasDropDownOptions = false;
        }
    } else {
        if (props.options.length === 0 || (props.options.length === 1 && props.options[0].value === props.value)) {
            hasDropDownOptions = false;
        }
    }

    useOutsideHandler(selectorRef, () => {

        if (true === active) {
            setTouched(true);
        }

        setActive(false);
    });

    useEffect(() => {

        if (true !== props.required) {
            return;
        }

        if (touched || props.wasSubmitted) {

            let isInputValid;

            if (props.multiple) {
                isInputValid = props.value.length > 0;
            } else {
                isInputValid = props.value && '' !== props.value ? true : false;
            }

            setDisplayErrorMessage(false === isInputValid);

        }

    }, [props.multiple, props.required, props.value, props.wasSubmitted, touched]);

    const Items = () => {

        let items = '';

        const currentValue = props.value;

        if (Array.isArray(currentValue)) {

            items = currentValue.map(value => {

                let item = props.options.filter(opt => opt.value === value)[0];

                if (!item) {

                    // ! If value is empty return null
                    if (!value) {
                        return null;
                    }

                    // ! If item is not found in options, create one with value as label
                    item = {
                        value: value,
                        label: value
                    }
                }

                return (
                    <StecDiv
                        key={item.value}
                        className='stec-select-input-item'
                        style={item.color ? { backgroundColor: item.color } : {}}>

                        {item.label}

                        {props.multiple && <StecSpan onClick={(e) => {

                            e.stopPropagation();

                            const newValues = [];

                            currentValue.forEach(valueItem => {
                                if (item.value !== valueItem) {
                                    newValues.push(valueItem);
                                }
                            });

                            setActive(false);

                            updateCurrentValue(newValues);

                            setTouched(true);

                        }}><i className='fa-solid fa-times' /></StecSpan>}
                    </StecDiv>
                );

            })
        } else {

            let item = props.options.filter(opt => opt.value === currentValue);

            if (item.length > 0) {
                item = item[0];
            } else {

                // ! If value is empty return null
                if (!currentValue) {
                    return null;
                }

                // ! If item is not found in options, create one with value as label
                item = {
                    value: currentValue,
                    label: currentValue
                }
            }

            items = <StecDiv
                key={item.value}
                className='stec-select-input-item'
                style={item.color ? { backgroundColor: item.color } : {}}>

                {item.label}

                {props.multiple && <StecSpan onClick={(e) => {

                    e.stopPropagation();

                    const newValues = [];

                    currentValue.forEach(valueItem => {
                        if (item.value !== valueItem) {
                            newValues.push(valueItem);
                        }
                    });

                    setActive(false);

                    updateCurrentValue(newValues);

                    setTouched(true);

                }}><i className='fa-solid fa-times' /></StecSpan>}
            </StecDiv>
        }

        return items;
    }

    return (
        <StecDiv className={classNameArray.join(' ')} ref={selectorRef} style={props.style}>
            <label>

                <FieldTitle text={props.title} />

                <StecDiv className='stec-select-input-wrap' tabIndex={-1} ref={ref}>

                    <StecDiv className='stec-select-input'
                        onClick={() => {

                            if (true === active) {
                                setTouched(true);
                            }

                            setActive(!active);
                        }}>

                        <Items />

                    </StecDiv>

                    <StecDiv className='stec-select-input-toggle-button' onClick={() => {
                        setActive(!active);
                    }}>{active ? <i className='fa-solid fa-chevron-down' /> : <i className='fa-solid fa-chevron-right' />}</StecDiv>
                </StecDiv>

                <StecDiv className='stec-select-dropdown-wrap' style={{ position: props.absoluteDropdown ? 'absolute' : 'static' }}>

                    <StecDiv style={{
                        width: '100%',
                    }}>

                        {hasDropDownOptions && props.options.length > 5 &&
                            <input
                                type="text"
                                className='stec-select-search'
                                placeholder={__('Search', 'stec')}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setSearch(false);
                                    } else {
                                        setSearch(e.target.value);
                                    }
                                }}
                            />}

                        <StecDiv className='stec-select-dropdown'>

                            {true === hasDropDownOptions ? filteredOptions.map((item) => {

                                let display = false;

                                if (props.multiple) {
                                    if (!props.value.includes(item.value)) {
                                        display = true;
                                    }
                                } else {
                                    if (props.value !== item.value) {
                                        display = true;
                                    }
                                }

                                if (display) {
                                    return <StecDiv
                                        className='stec-select-dropdown-item'
                                        key={item.value}
                                        value={item.value}
                                        onClick={() => {
                                            setActive(false);
                                            updateCurrentValue(props.multiple ? [...props.value, item.value] : item.value);
                                            setTouched(true);
                                        }}>
                                        {item.label}
                                    </StecDiv>
                                } else {
                                    return '';
                                }

                            }) : <StecSpan className='stec-select-dropdown-noitems'>{'No items available'}</StecSpan>}
                        </StecDiv>

                    </StecDiv>


                </StecDiv>

                <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

                <FieldDescription text={props.description} />
            </label>

        </StecDiv>
    )
})

InputSelect.displayName = 'InputSelect';

export const UncontrolledInputSelect = React.forwardRef((props, ref) => {

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
    const [currentValue, setCurrentValue] = useState(props.defaultValue);
    const [active, setActive] = useState(false);
    const [search, setSearch] = useState(false);
    const classNameArray = ['stec-select-wrapper'];
    const selectorRef = useRef(null);
    const filteredOptions = props.options.filter((opt) => {

        if (!search) {
            return opt;
        }

        if (opt.search) {

            if (opt.search.toLowerCase().includes(search.toLowerCase())) {
                return opt;
            }

        } else {

            if (opt.label.toLowerCase().includes(search.toLowerCase())) {
                return opt;
            }

        }

        return null;
    });

    const updateCurrentValue = (value) => {

        setCurrentValue(value);

        if (props.onChange) {
            props.onChange(value);
        }
    }

    let hasDropDownOptions = true;

    if (active) {
        classNameArray.push('active');
    }

    if (props.multiple) {
        classNameArray.push('multiple');

        if (currentValue.length === props.options.length) {
            hasDropDownOptions = false;
        }
    } else {
        if (props.options.length === 0 || (props.options.length === 1 && props.options[0].value === currentValue)) {
            hasDropDownOptions = false;
        }
    }

    const Items = () => {

        let items = '';

        if (Array.isArray(currentValue)) {

            items = currentValue.map(value => {

                let item = props.options.filter(opt => opt.value === value)[0];

                if (!item) {

                    // ! If value is empty return null
                    if (!value) {
                        return null;
                    }

                    // ! If item is not found in options, create one with value as label
                    item = {
                        value: value,
                        label: value
                    }
                }

                return (
                    <StecDiv
                        key={item.value}
                        className='stec-select-input-item'
                        style={item.color ? { backgroundColor: item.color } : {}}>

                        {item.label}

                        {props.multiple && <StecSpan onClick={(e) => {

                            e.stopPropagation();

                            const newValues = [];

                            currentValue.forEach(valueItem => {

                                if (item.value !== valueItem) {
                                    newValues.push(valueItem);
                                }
                            });

                            setActive(false);

                            updateCurrentValue(newValues);

                            setTouched(true);

                        }}><i className='fa-solid fa-times' /></StecSpan>}
                    </StecDiv>
                );

            })

        } else {

            let item = props.options.filter(opt => opt.value === currentValue);

            if (item.length > 0) {
                item = item[0];
            } else {

                // ! If value is empty return null
                if (!currentValue) {
                    return null;
                }

                // ! If item is not found in options, create one with value as label
                item = {
                    value: currentValue,
                    label: currentValue
                }
            }

            items = <StecDiv
                key={item.value}
                className='stec-select-input-item'
                style={item.color ? { backgroundColor: item.color } : {}}>

                {item.label}

                {props.multiple && <StecSpan onClick={(e) => {

                    e.stopPropagation();

                    const newValues = [];

                    currentValue.forEach(valueItem => {
                        if (item.value !== valueItem) {
                            newValues.push(valueItem);
                        }
                    });

                    setActive(false);

                    updateCurrentValue(newValues);

                    setTouched(true);

                }}><i className='fa-solid fa-times' /></StecSpan>}
            </StecDiv>
        }

        return items;
    }

    useOutsideHandler(selectorRef, () => {

        if (true === active) {
            setTouched(true);
        }

        setActive(false);
    });

    useEffect(() => {

        if (true !== props.required) {
            return;
        }

        if (touched || props.wasSubmitted) {

            let isInputValid;

            if (props.multiple) {
                isInputValid = currentValue.length > 0;
            } else {
                isInputValid = currentValue && '' !== currentValue ? true : false;
            }

            setDisplayErrorMessage(false === isInputValid);

        }

    }, [currentValue, props.multiple, props.required, props.wasSubmitted, touched]);


    return (
        <StecDiv className={classNameArray.join(' ')} ref={selectorRef} style={props.style}>
            <label>

                <FieldTitle text={props.title} />

                <StecDiv className='stec-select-input-wrap' tabIndex={-1} ref={ref}>

                    <StecDiv className='stec-select-input' onClick={() => {

                        if (true === active) {
                            setTouched(true);
                        }

                        setActive(!active);
                    }}>

                        <Items />

                    </StecDiv>

                    <StecDiv className='stec-select-input-toggle-button' onClick={() => {
                        setActive(!active);
                    }}>{active ? <i className='fa-solid fa-chevron-down' /> : <i className='fa-solid fa-chevron-right' />}</StecDiv>
                </StecDiv>

                <StecDiv className='stec-select-dropdown-wrap' style={{ position: props.absoluteDropdown ? 'absolute' : 'static' }}>

                    {hasDropDownOptions && props.options.length > 5 &&
                        <input
                            type="text"
                            className='stec-select-search'
                            placeholder={__('Search', 'stec')}
                            onChange={(e) => {
                                if (!e.target.value) {
                                    setSearch(false);
                                } else {
                                    setSearch(e.target.value);
                                }
                            }}
                        />}

                    <StecDiv className='stec-select-dropdown'>

                        {true === hasDropDownOptions ? filteredOptions.map((item) => {

                            let display = false;

                            if (props.multiple) {
                                if (!currentValue.includes(item.value)) {
                                    display = true;
                                }
                            } else {
                                if (currentValue !== item.value) {
                                    display = true;
                                }
                            }

                            if (display) {
                                return <StecDiv
                                    className='stec-select-dropdown-item'
                                    key={item.value}
                                    value={item.value}
                                    onClick={() => {
                                        setActive(false);
                                        updateCurrentValue(props.multiple ? [...currentValue, item.value] : item.value);
                                        setTouched(true);
                                    }}>
                                    {item.label}
                                </StecDiv>
                            } else {
                                return '';
                            }

                        }) : <StecSpan className='stec-select-dropdown-noitems'>{'No items available'}</StecSpan>}
                    </StecDiv>

                </StecDiv>

                <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />

                <FieldDescription text={props.description} />
            </label>

            {props.name && <input required={props.required} type="hidden" name={props.name} value={props.multiple ? JSON.stringify(currentValue) : currentValue} />}

        </StecDiv>
    )
})

UncontrolledInputSelect.displayName = 'UncontrolledInputSelect';

export default InputSelect;
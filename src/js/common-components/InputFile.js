import { StecDiv } from '@Stec/WebComponents';
import { useRef } from 'react';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import InvalidField from './InvalidField';
import { useEffect, useState } from 'react';

export const UncontrolledInputFile = React.forwardRef((props, ref) => {

    const [currentValue, setCurrentValue] = useState(props.defaultValue);
    const inputFileRef = useRef();
    const formRef = useRef();

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    useEffect(() => {

        if (currentValue === '' || !currentValue) {
            formRef.current.reset();
        }

    }, [currentValue]);


    useEffect(() => {

        if ((touched || props.wasSubmitted) && props.required) {

            setDisplayErrorMessage(!currentValue);

        }

    }, [props.required, currentValue, props.wasSubmitted, touched]);

    const updateCurrentValue = (value) => {

        setCurrentValue(value);

        if (props.onChange) {
            props.onChange(value);
        }
    }

    return (
        <StecDiv className='stec-input-file-wrapper'>
            <label>
                <FieldTitle text={props.title} />

                <StecDiv className='stec-input-file-inner-wrap'>
                    <input
                        ref={ref}
                        onBlur={() => setTouched(true)}
                        type={'text'}
                        readOnly={true}
                        name={props.name}
                        value={currentValue?.name || ''} 
                        placeholder={props.placeholder}
                        onChange={props.onChange}
                        style={{ cursor: 'select' }}
                        onClick={() => {
                            inputFileRef.current.click();
                        }}
                    />

                    <i className='fas fa-file-circle-plus' />
                </StecDiv>

                <form ref={formRef}>
                    <input ref={inputFileRef} type='file' accept={props.accept}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            updateCurrentValue(file);
                        }} />
                </form>

                <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />
                <FieldDescription text={props.description} />
            </label>
        </StecDiv>
    )
});

UncontrolledInputFile.displayName = 'UncontrolledInputFile';

const InputFile = React.forwardRef((props, ref) => {

    const inputFileRef = useRef();
    const formRef = useRef();

    const [touched, setTouched] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    useEffect(() => {

        if (props.value === '' || !props.value) {
            formRef.current.reset();
        }

    }, [props.value]);


    useEffect(() => {

        if ((touched || props.wasSubmitted) && props.required) {

            setDisplayErrorMessage(!props.value);

        }

    }, [props.required, props.value, props.wasSubmitted, touched]);

    return (
        <StecDiv className='stec-input-file-wrapper'>
            <label>
                <FieldTitle text={props.title} />

                <StecDiv className='stec-input-file-inner-wrap'>
                    <input
                        ref={ref}
                        onBlur={() => setTouched(true)}
                        type={'text'}
                        readOnly={true}
                        name={props.name}
                        value={props.value}
                        placeholder={props.placeholder}
                        onChange={props.onChange}
                        style={{ cursor: 'select' }}
                        onClick={() => {
                            inputFileRef.current.click();
                        }}
                    />

                    <i className='fas fa-file-circle-plus' />
                </StecDiv>

                <form ref={formRef}>
                    <input ref={inputFileRef} type='file' accept={props.accept}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            props.onChange(file);
                        }} />
                </form>

                <InvalidField floating={true} text={props.errorMessage} display={displayErrorMessage} />
                <FieldDescription text={props.description} />
            </label>
        </StecDiv>
    )
});

InputFile.displayName = 'InputFile';

export default InputFile
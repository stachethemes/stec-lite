import { faAll } from '@Stec/JS/font-awesome-icons-list';
import { useOutsideHandler } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import Button from './Button';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
const { useState, useRef } = wp.element;

const IconPicker = ({ title, value, description, onPick }) => {

    const iconPickerRef = useRef(null);
    const classNameArray = ['stec-icon-picker-wrapper'];
    const [isActive, setActive] = useState(false);
    const [foundIcons, setFoundIcons] = useState([]);
    const currentIconClassName = value ? value : '';
    const onSearchKeyPress = (input) => {

        const iconsArray = [];

        if (input.length <= 2) {
            setFoundIcons([]);
            return;
        }

        faAll.forEach((iconClassName) => {
            if (iconClassName.includes(input)) {
                iconsArray.push(iconClassName);
            }
        });

        setFoundIcons(iconsArray);
    }

    useOutsideHandler(iconPickerRef, () => {
        setActive(false);
    });


    if (true === isActive) {
        classNameArray.push('active');
    }

    return (
        <StecDiv className={classNameArray.join(' ')} ref={iconPickerRef}>

            {<FieldTitle text={title} />}

            <StecDiv style={{ position: 'relative' }}>
                <label onClick={() => {
                    setActive(!isActive)
                }}>
                    <StecDiv className='stec-icon-picker-selected'>{<i className={currentIconClassName} />}</StecDiv>

                    {<FieldDescription text={description} />}
                </label>

                <StecDiv className='stec-icon-picker-container'>
                    <input type="text" placeholder={__('Search icon', 'stachethemes_event_calendar_lite')} onChange={(e) => {
                        onSearchKeyPress(e.target.value);
                    }} />

                    {foundIcons.length > 0 &&
                        <StecDiv className='stec-icon-picker-list'>
                            {foundIcons.map(iconClassName => {
                                return <StecDiv key={iconClassName} className='stec-icon-picker-list-icon' onClick={() => {
                                    onPick(iconClassName);
                                }}><i className={iconClassName} /></StecDiv>
                            })}
                        </StecDiv>}

                    <Button className='blue' style={{ marginTop: '10px' }} label={__('Clear', 'stachethemes_event_calendar_lite')} onClick={() => {
                        onPick('');
                    }} />
                </StecDiv>

            </StecDiv>
        </StecDiv>
    )
}
export default IconPicker
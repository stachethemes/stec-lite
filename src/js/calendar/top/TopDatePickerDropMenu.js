import { useCalendarMoment, useCurrentLayout, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { useOutsideHandler } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { useRef, useState } from 'react';
import TopButton from './TopButton';
import MobileDatePicker from './TopMobileDatePicker';

const TopDatePickerDropMenu = () => {

    const { value: currentValue } = useCurrentLayout();
    const { safeValue: activeCalendarDate } = useCalendarMoment();
    const topSingleLine = useSettingsAtt('calendar__top_single_line');
    const containerRef = useRef();
    const [active, setActive] = useState(false);

    useOutsideHandler(containerRef, active ? () => {
        setActive(false);
    } : null);

    if (!topSingleLine) {
        return null;
    }

    let dateDisplayFormat = '';

    switch (currentValue) {
        case 'month':
        case 'week':
        case 'map':
        case 'grid':
        case 'boxgrid': {
            dateDisplayFormat = 'MMM, YYYY';
            break;
        }

        default: {
            dateDisplayFormat = 'D MMM, YYYY';
        }
    }

    const dateDisplay = activeCalendarDate.format(dateDisplayFormat);

    const label = []

    label.push(
        <span key='text' className='stec-top-menu-datepicker-label'>{dateDisplay}</span>
    );

    return (
        <StecDiv className='stec-top-datepicker-dropdown-menu-wrap' ref={containerRef}>

            {active &&
                <StecDiv className='stec-top-datepicker-dropdown-menu'>
                    <MobileDatePicker forceFullLabels={false} />
                </StecDiv>
            }

            <TopButton
                extraClass={`${active ? 'active' : ''}`}
                label={label}
                active={false}
                onClick={(e) => {
                    setActive(!active);
                }} />


        </StecDiv>
    )
}

export default TopDatePickerDropMenu;
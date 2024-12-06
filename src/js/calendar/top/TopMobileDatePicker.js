import { useCalendarScreenTypeValue, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv } from '@Stec/WebComponents';
import TopDatePicker from './TopDatePicker';

const MobileDatePicker = (props) => {

    const topNavButtonsEnabled = useSettingsAtt('calendar__top_nav_buttons');
    const topNavDatepickerEnabled = useSettingsAtt('calendar__top_datepicker_menu');
    const screenType = useCalendarScreenTypeValue();

    const classNameArray = ['stec-top-menu-datepicker-mobile'];

    if (screenType !== 'mobile') {
        return null;
    }

    if (!topNavButtonsEnabled && !topNavDatepickerEnabled) {
        return null;
    }

    if (!topNavDatepickerEnabled) {
        classNameArray.push('stec-top-menu-datepicker-mobile-no-datepicker');
    }

    return (

        <StecDiv className={classNameArray.join(' ')}>
            <TopDatePicker forceFullLabels={props.forceFullLabels ?? true} />
        </StecDiv>

    )

}

export default MobileDatePicker;
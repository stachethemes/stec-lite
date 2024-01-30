import { useCalendarScreenTypeValue, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv } from '@Stec/WebComponents';
import DashboardButton from './DashboardButton';
import InlineItems from './InlineItems';
import TopFiltersMenu from './TopFiltersMenu';
import TopLayoutDropdownMenu from './TopLayoutDropdownMenu';
import TopLayoutMenu from './TopLayoutMenu';
import TopMainMenu from './TopMainMenu';
import TopDatePicker from './TopDatePicker';

const MobileDatePicker = () => {

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
            <TopDatePicker forceFullLabels={true} />
        </StecDiv>

    )

}

const Top = () => {

    const topEnabled = useSettingsAtt('calendar__top_enabled');
    const topFilterMode = useSettingsAtt('calendar__top_filters_menu');
    const displayLayoutsMenu = useSettingsAtt('calendar__top_layouts_menu');
    const screenType = useCalendarScreenTypeValue();

    if (!topEnabled) {
        return null;
    }

    return (
        <StecDiv className='stec-top'>

            <StecDiv className='stec-top-flex'>

                <TopMainMenu />

                {
                    displayLayoutsMenu && <>
                        {'' === screenType && <TopLayoutMenu />}
                        {'' !== screenType && <TopLayoutDropdownMenu />}
                    </>
                }

            </StecDiv>

            <MobileDatePicker />

            {
                2 === topFilterMode && <>
                    <TopFiltersMenu staticMode={true} />
                </>
            }

            <InlineItems />

            <DashboardButton />

        </StecDiv>
    )
}

export default Top

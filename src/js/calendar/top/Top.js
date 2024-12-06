import { useCalendarScreenTypeValue, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv } from '@Stec/WebComponents';
import DashboardButton from './DashboardButton';
import InlineItems from './InlineItems';
import TopFiltersMenu from './TopFiltersMenu';
import TopLayoutDropdownMenu from './TopLayoutDropdownMenu';
import TopLayoutMenu from './TopLayoutMenu';
import TopMainMenu from './TopMainMenu';
import MobileDatePicker from './TopMobileDatePicker';

const Top = () => {

    const topEnabled = useSettingsAtt('calendar__top_enabled');
    const topFilterMode = useSettingsAtt('calendar__top_filters_menu');
    const displayLayoutsMenu = useSettingsAtt('calendar__top_layouts_menu');
    const topSingleLine = useSettingsAtt('calendar__top_single_line');
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

            {!topSingleLine && <MobileDatePicker />}

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

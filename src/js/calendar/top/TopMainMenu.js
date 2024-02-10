import { useAgendaSliderKey, useCalendarMoment, useCalendarScreenTypeValue, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { uniqueId } from 'lodash';
import TopButton from './TopButton';
import TopDatePicker from './TopDatePicker';
import TopFilters from './TopFilters';
import TopSearch from './TopSearch';

const TopMainMenuToday = () => {

    const { setValue: setCalendarMoment } = useCalendarMoment();
    const { setValue: setAgendaSliderKey } = useAgendaSliderKey();

    return <TopButton
        label={
            [
                <i key='icon' className='stec-top-menu-today-icon fa-solid fa-calendar-check' />,
                <span key='text' className='stec-top-menu-today-label'>{__('Today', 'stachethemes_event_calendar_lite')}</span>
            ]
        }
        onClick={() => {
            setCalendarMoment(moment());
            setAgendaSliderKey(uniqueId());
        }} />
}

function TopMainMenu() {

    const todayButtonEnabled = useSettingsAtt('calendar__top_today_button');
    const searchButtonEnabled = useSettingsAtt('calendar__top_search_menu');
    const topFilterMode = useSettingsAtt('calendar__top_filters_menu');
    const screenType = useCalendarScreenTypeValue();

    return (
        <StecDiv className='stec-top-main-menu'>

            <StecDiv className='stec-top-main-menu-section'>
                {todayButtonEnabled && <TopMainMenuToday />}
                {searchButtonEnabled && <TopSearch />}
                {1 === topFilterMode && <TopFilters />}

            </StecDiv>

            {
                screenType !== 'mobile' &&
                <StecDiv className='stec-top-main-menu-section'>
                    <TopDatePicker />
                </StecDiv>
            }

        </StecDiv>
    )


}

export default TopMainMenu
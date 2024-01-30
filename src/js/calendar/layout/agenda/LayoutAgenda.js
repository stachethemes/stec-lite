import { useAgendaSliderKey, useCalendarMoment, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import '@Stec/LESS/calendar/layout/agenda/style.less';
import { StecDiv } from '@Stec/WebComponents';
import AgendaList from './AgendaList';
import AgendaSlider from './AgendaSlider';

const LayoutAgenda = () => {

    const { value: agendaSliderKey } = useAgendaSliderKey();
    const showAgendaList = useSettingsAtt('layouts__agenda_list');
    const showAgendaSlider = useSettingsAtt('layouts__agenda_slider');

    const { safeValue: calendarMoment } = useCalendarMoment();
    const day = calendarMoment.date();
    const month = calendarMoment.month();
    const year = calendarMoment.year();

    return (
        <StecDiv className={'stec-layout-agenda'}>

            {showAgendaSlider && <AgendaSlider key={`agenda-slider-${agendaSliderKey}`} />}

            {
                showAgendaList && <AgendaList
                    key={`agenda-list-${day}-${month}-${year}`}
                    day={day}
                    month={month}
                    year={year}
                />

            }

        </StecDiv>
    )
}

export default LayoutAgenda
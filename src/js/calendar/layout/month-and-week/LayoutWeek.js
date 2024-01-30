import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import '@Stec/LESS/calendar/layout/month-and-week/style.less';
import { StecDiv } from '@Stec/WebComponents';
import CalendarWeekLabels from './CalendarWeekLabels';
import CellsContainer from './CellsContainer';

function LayoutWeek() {

    const cellStyleVariant = useSettingsAtt('layouts__month_week_style');

    const classNameArray = ['stec-layout-week'];

    if ('fixed' === cellStyleVariant) {
        classNameArray.push('stec-layout-week-fixed-style');
    }

    return (

        <StecDiv className={classNameArray.join(' ')}>

            <CalendarWeekLabels layoutType={'week'} />

            <CellsContainer layoutType={'week'} />

        </StecDiv>
    )
}

export default LayoutWeek
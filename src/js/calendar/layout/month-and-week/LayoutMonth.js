import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import '@Stec/LESS/calendar/layout/month-and-week/style.less';
import { StecDiv } from '@Stec/WebComponents';
import CalendarWeekLabels from './CalendarWeekLabels';
import CellsContainer from './CellsContainer';

function LayoutMonth() {

    const cellStyleVariant = useSettingsAtt('layouts__month_week_style');

    const classNameArray = ['stec-layout-month'];

    if ('fixed' === cellStyleVariant) {
        classNameArray.push('stec-layout-month-fixed-style');
    }

    return (

        <StecDiv className={classNameArray.join(' ')}>

            <CalendarWeekLabels layoutType={'month'} />

            <CellsContainer layoutType={'month'} />

        </StecDiv>
    )
}

export default LayoutMonth
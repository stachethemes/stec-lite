import CalendarAtts from './CalendarAtts';
import CalendarPreloader from './CalendarPreloader';

function CalendarSetup({ settingsAtts, children }) {

    return (
        <CalendarAtts settingsAtts={settingsAtts}>
            <CalendarPreloader>
                {children}
            </CalendarPreloader>
        </CalendarAtts>
    )

}

export default CalendarSetup
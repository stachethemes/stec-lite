import { getDayLabels, getMonthLabel } from '@Stec/JS/helpers';
import { useCustomLayoutEvents } from '@Stec/JS/calendar/hooks';
import { useEffect, useState } from 'react';
import AgendaSliderCell from './AgendaSliderCell';
import { StecDiv } from '@Stec/WebComponents';

const TheContent = (props) => {

    const [content, setContent] = useState(false);

    const rangesFormat = 'YYYY-MM-DD HH:mm:ss';
    const startRange = moment(props.momentDate).startOf('month').utc().format(rangesFormat);
    const endRange = moment(props.momentDate).endOf('month').utc().format(rangesFormat);

    const [events, eventsReady] = useCustomLayoutEvents({
        start: startRange,
        end: endRange,
    }, {
        sortEventsInYMDkeys: true
    }, props.workerThread);

    useEffect(() => {

        const getCellsContent = () => {
            const contents = [];
            const dayLabels = getDayLabels('short');
            const momentDateIterator = moment(props.momentDate);
            const daysInMonth = momentDateIterator.daysInMonth();
            const todayYMD = moment().format('YMD');

            for (let i = 1; i <= daysInMonth; i++) {
                const dayLabel = dayLabels[momentDateIterator.day()];
                const day = momentDateIterator.format('D');
                const dateString = momentDateIterator.format('YYYY-MM-DD');
                const cellEvents = events[dateString] || false;
                const isToday = todayYMD === momentDateIterator.format('YMD');

                if (momentDateIterator.date() === 1) {

                    contents.push(
                        <AgendaSliderCell
                            key={momentDateIterator.format('YM')}
                            day={getMonthLabel(momentDateIterator.month(), 'short')}
                            dayLabel={momentDateIterator.format('YYYY')}
                            highlight={true}
                        />
                    );

                }

                if (eventsReady) {
                    contents.push(<AgendaSliderCell
                        key={dateString}
                        isActive={props.activeCell && props.activeCell.moment.isSame(momentDateIterator, 'day')}
                        day={day}
                        isToday={isToday}
                        dayLabel={dayLabel}
                        events={cellEvents}
                        momentDate={dateString}
                        onCellClick={props.onCellClick}
                    />)
                } else {
                    contents.push(<AgendaSliderCell
                        key={dateString}
                        isActive={props.activeCell && props.activeCell.moment.isSame(momentDateIterator, 'day')}
                        day={day}
                        isToday={isToday}
                        dayLabel={dayLabel}
                        loading={true}
                        momentDate={dateString}
                        onCellClick={props.onCellClick}
                    />);
                }

                momentDateIterator.add(1, 'day');
            }

            return contents;
        }

        if (props.momentDate) {
            const newContent = getCellsContent();
            setContent(newContent);
        }

    }, [props.activeCell, eventsReady, props.onCellClick, events, props.momentDate]);

    useEffect(() => {

        if (eventsReady) {
            props.onEventsReady(events);
        }

    }, [events, eventsReady, props]);

    return content;
};

/**
 * Initially props.moment is false and this would cause problems
 * 
 * That's why this component was split in two
 * TheContent should be rendered only when props.moment is set
 * 
 * NOTE: ref should always be available... if we return null the drag won't work
 */
const AgendaSliderContent = React.forwardRef((props, ref) => {

    return <StecDiv ref={ref}>
        {props.momentDate && <TheContent {...props} />}
    </StecDiv>

});

AgendaSliderContent.displayName = 'AgendaSliderContent';

export default AgendaSliderContent

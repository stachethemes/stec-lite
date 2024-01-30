import '@Stec/LESS/calendar/layout/grid/style.less';
import Masonry from 'react-responsive-masonry';
import GridEvent from './GridEvent';

function GridEvents({ events, columnsCount, gridGutter, onEventActive }) {

    return (
        <Masonry columnsCount={columnsCount} gutter={gridGutter}>

            {
                events.map(event => {

                    const eventKey = `${event.id}-${event.meta.start_date}`;

                    return (
                        <GridEvent
                            key={eventKey}
                            event={event}
                            onActive={() => {
                                const scrollOffset = window.scrollY || document.documentElement.scrollTop;
                                onEventActive(eventKey, scrollOffset);
                            }} />
                    )
                })
            }
            
        </Masonry>

    )
}

export default GridEvents
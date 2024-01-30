import '@Stec/LESS/calendar/layout/boxgrid/style.less';
import Masonry from 'react-responsive-masonry';
import BoxGridEvent from './BoxGridEvent';

function BoxGridEvents({ events, columnsCount, gridGutter, onEventActive }) {

    return (
        <Masonry columnsCount={columnsCount} gutter={gridGutter}>

            {
                events.map(event => {

                    const eventKey = `${event.id}-${event.meta.start_date}`;

                    return (
                        <BoxGridEvent
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

export default BoxGridEvents
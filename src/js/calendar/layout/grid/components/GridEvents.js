import '@Stec/LESS/calendar/layout/grid/style.less';
import { StecDiv } from '@Stec/WebComponents';
import Masonry from 'react-responsive-masonry';
import GridEvent from './GridEvent';

function GridEvents({ events, columns, gutter, onEventActive }) {

    return (
        <StecDiv className='stec-layout-grid-wrap'>
            <Masonry columnsCount={columns} gutter={`${gutter}px`}>
                {
                    events.map(event => {

                        const eventKey = `${event.id}-${event.meta.start_date}`;

                        return (
                            <GridEvent
                                key={eventKey}
                                event={event}
                                onActive={() => {
                                    onEventActive(eventKey);
                                }} />
                        )
                    })
                }
            </Masonry>
        </StecDiv>

    )
}

export default GridEvents
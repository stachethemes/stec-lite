import '@Stec/LESS/calendar/layout/boxgrid/style.less';
import { StecDiv } from '@Stec/WebComponents';
import Masonry from 'react-responsive-masonry';
import BoxGridEvent from './BoxGridEvent';

function BoxGridEvents({ events, columns, gutter, onEventActive }) {

    return (
        <StecDiv className='stec-layout-boxgrid-wrap'>
            <Masonry columnsCount={columns} gutter={`${gutter}px`}>
                {
                    events.map(event => {

                        const eventKey = `${event.id}-${event.meta.start_date}`;

                        return (
                            <BoxGridEvent
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

export default BoxGridEvents
import Event from '@Stec/JS/calendar/event/Event';
import { sortEventsByFeatured } from '@Stec/JS/helpers';
import { useState } from 'react';
import PreviewContainer from './PreviewContainer';

/**
 * Prepares PreviewContainer for events
 */
const PreviewEvents = ({
    events,
    moreButtonEnabled = true,
    limit = false,
    onListEnd = false,
    sortByFeatured = false
}) => {

    const [active, setActive] = useState(false);

    let contents = [];

    const eventsList = sortByFeatured ? sortEventsByFeatured(events) : events;

    eventsList.forEach(event => {

        const eventKey = `${event.id}-${event.meta.start_date}`;

        contents.push(<Event key={eventKey} event={event} active={active === eventKey} onActiveToggle={() => {

            if (active === eventKey) {
                setActive(false);
            } else {
                setActive(eventKey);
            }

        }} />);
    });

    return (
        <PreviewContainer
            moreButtonEnabled={moreButtonEnabled}
            limit={limit}
            onListEnd={onListEnd}>
            {contents}
        </PreviewContainer>
    )

}

export default PreviewEvents;
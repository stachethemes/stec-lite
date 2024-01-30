import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useRef } from 'react';

function EventDescription({ event, style }) {

    const descriptionRef = useRef();

    // Call "on description render" global trigger
    useEffect(() => {

        if (event?.description) {
            if (typeof window.stecOnEventDescriptionRender === 'function') {
                window.stecOnEventDescriptionRender({
                    data: event,
                    element: descriptionRef.current
                });
            }
        }

    }, [event]);

    if (!event.description || '' === event.description) {
        return null;
    }

    return (
        <StecDiv
            ref={descriptionRef}
            className='stec-event-description'
            style={style}
            dangerouslySetInnerHTML={{ __html: event.description }}
        />
    )
}

export default EventDescription
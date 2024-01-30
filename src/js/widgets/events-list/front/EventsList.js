import '@Stec/LESS/widgets/events-list/front/style.less';
import { StecDiv } from '@Stec/WebComponents';
import EventPreview from './EventPreview';
import Skeleton from './Skeleton';
import { useEvents, useEventsPrefetch } from './hooks';

function EventsListPrefetchFetch(props) {

    const { items, ready, error } = useEventsPrefetch(props);

    if (!ready || error) {
        return null;
    }

    return (
        <>

            {props.title && <StecDiv className='stec-widget-events-list-title'>
                {props.title}
            </StecDiv>}

            {(ready && !error) && items.map((event, i) => {

                return <EventPreview widgetProps={props} key={i} event={event} />

            })}


        </>
    )
}

function EventsListFetch(props) {

    const { items, ready, error } = useEvents(props);

    return (
        <>

            {props.title && <StecDiv className='stec-widget-events-list-title'>
                {props.title}
            </StecDiv>}


            {(!ready && !error) && <Skeleton quantity={props.limit} />}

            {(ready && !error) && items.map((event, i) => {

                return <EventPreview widgetProps={props} key={i} event={event} />

            })}


        </>
    )
}

function EventsList(props) {

    if (props.events_prefetch) {
        return <EventsListPrefetchFetch {...props} />
    }

    return <EventsListFetch {...props} />

}

export default EventsList

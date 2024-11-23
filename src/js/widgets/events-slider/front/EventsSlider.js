import '@Stec/LESS/widgets/events-slider/front/style.less';
import Slider from './components/Slider';
import { useEvents, useEventsPrefetch } from './hooks';

function EventsSliderPrefetch(props) {

    const { items, ready, error } = useEventsPrefetch(props);

    if (!ready || error) {
        return null;
    }

    // No events found, return null
    if (!Array.isArray(items) || items.length <= 0) {
        return null;
    }

    return (

        <Slider
            events={items}
            widgetProps={props}
        />

    )

}

function EventsSliderFetch(props) {

    const { items, ready, error } = useEvents(props);

    if (!ready || error) {
        return null;
    }

    return (
        <Slider
            events={items}
            widgetProps={props}
        />
    )
}

function EventsSlider(props) {

    if (props.events_prefetch) {
        return <EventsSliderPrefetch {...props} />
    }

    return <EventsSliderFetch {...props} />

}

export default EventsSlider

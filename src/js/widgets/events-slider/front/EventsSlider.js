import { isMobile } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { useRef, useEffect } from 'react';
import EventsSliderContainer from './EventsSliderContainer';
import { useEvents, useEventsPrefetch } from './hooks';
import '@Stec/LESS/widgets/events-slider/front/style.less';

function EventsSliderPrefetch(props) {

    const { items, ready, error } = useEventsPrefetch(props);
    const wrapperRef = useRef(null);

    const classNameArray = ['stec-widget-events-slider-wrapper'];

    useEffect(() => {

        if (ready) {

            const element = document.getElementById(props.id);

            if (element) {
                element.style.height = '';
                element.style.backgroundColor = '';
            }

        }

    }, [ready, props.id]);

    if (!ready || error) {
        return null;
    }

    // No events found, return null
    if (!Array.isArray(items) || items.length <= 0) {
        return null;
    }

    if (isMobile()) {
        classNameArray.push('stec-widget-events-slider-wrapper-is-mobile');
    }

    return (

        <StecDiv className={classNameArray.join(' ')} ref={wrapperRef}>

            <EventsSliderContainer
                wrapperRef={wrapperRef}
                events={items}
                widgetProps={props}
            />

        </StecDiv>

    )

}

function EventsSliderFetch(props) {

    const { items, ready, error } = useEvents(props);
    const wrapperRef = useRef(null);

    const classNameArray = ['stec-widget-events-slider-wrapper'];

    useEffect(() => {

        if (ready) {

            const element = document.getElementById(props.id);

            if (element) {
                element.style.height = '';
                element.style.backgroundColor = '';
            }

        }

    }, [ready, props.id]);

    if (!ready || error) {
        return null;
    }

    // No events found, return null
    if (!Array.isArray(items) || items.length <= 0) {
        return null;
    }

    if (isMobile()) {
        classNameArray.push('stec-widget-events-slider-wrapper-is-mobile');
    }

    return (

        <StecDiv className={classNameArray.join(' ')} ref={wrapperRef}>

            <EventsSliderContainer
                wrapperRef={wrapperRef}
                events={items}
                widgetProps={props}
            />

        </StecDiv>

    )
}

function EventsSlider(props) {

    if (props.events_prefetch) {
        return <EventsSliderPrefetch {...props} />
    }

    return <EventsSliderFetch {...props} />

}

export default EventsSlider

import Event from '@Stec/JS/calendar/event/Event';
import EventSchema from '@Stec/JS/calendar/event/EventSchema';
import { useCalendarScreenType, useSettingsAtts } from '@Stec/JS/calendar/hooks';
import { useEventById } from '@Stec/JS/hooks';
import toasterOptions from '@Stec/JS/toaster-options';
import '@Stec/LESS/pages/single-page/style.less';
import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { RecoilRoot } from 'recoil';

const EventToDisplay = ({ event }) => {

    const containerRef = useRef(false);
    const screenType = useCalendarScreenType(containerRef);

    return (
        <StecDiv ref={containerRef} className={screenType}>

            <Event event={event} active={true} forceActive={true} forceOpenIn='calendar' />

            <EventSchema event={event} />

        </StecDiv>
    )
}

const PrepareAtts = ({ atts, children }) => {

    const [ready, setReady] = useState(false);
    const { setValue: setAttributes } = useSettingsAtts();

    useEffect(() => {

        if (false === ready) {
            setAttributes(atts);
            setReady(true);
        }

    }, [atts, ready, setAttributes]);

    if (false === ready) {
        return null;
    }

    return children;

}

function SinglePageFetch({ atts }) {

    const { item: event, ready: ready, error } = useEventById({
        id: atts.event_id,
        offsetDate: atts.offset_date || false,
        permissionType: 'read_permission'
    });

    if (true !== ready) {
        return null;
    }

    if (false !== error) {
        return null;
    }

    return (
        <RecoilRoot>
            <Toaster {...toasterOptions} />
            <PrepareAtts atts={atts}>
                <EventToDisplay event={event} />
            </PrepareAtts>
        </RecoilRoot>
    )
}

function SinglePagePrefetch({ atts }) {

    const event = atts['event_data'];

    return (
        <RecoilRoot>
            <Toaster {...toasterOptions} />
            <PrepareAtts atts={atts}>
                <EventToDisplay event={event} />
            </PrepareAtts>
        </RecoilRoot>
    )
}

function SinglePage({ atts }) {

    if (atts['event_data']) {
        return <SinglePagePrefetch atts={atts} />
    }

    return <SinglePageFetch atts={atts} />

}

export default SinglePage
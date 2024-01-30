import { useEventStructure } from '@Stec/JS/calendar/hooks';
import EventContentSkeleton from '@Stec/JS/calendar/skeletons/EventContentSkeleton';
import '@Stec/LESS/calendar/event/style.less';
import { StecDiv } from '@Stec/WebComponents';
import { getStructureComponent } from './structure';

const EventContentRender = ({ structure, event }) => {

    return (
        <StecDiv className='stec-event-content'>

            {
                structure.map(element => {

                    return getStructureComponent(element, event);

                })
            }

        </StecDiv>
    )

}

function EventContent({ event }) {

    const { value: structure, ready, isError } = useEventStructure({
        templateId: event.meta.structure_id || undefined
    });

    if (!ready) {
        return <EventContentSkeleton />;
    }

    if (isError) {
        return null;
    }

    return (
        <EventContentRender structure={structure} event={event} />
    )
}

export default EventContent;

import PreviewEvents from '@Stec/JS/calendar/common/PreviewEvents';

function AgendaSliderEventsHolder(props) {

    if (!props.activeMoment) {
        return '';
    }

    const eventsYMDkey = props.activeMoment.format('YYYY-MM-DD');
    const events = props.eventsA[eventsYMDkey] || props.eventsB[eventsYMDkey];

    return (
        <PreviewEvents events={events || []} />
    )
}

export default AgendaSliderEventsHolder

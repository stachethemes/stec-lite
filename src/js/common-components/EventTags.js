import { eventHasHealthMeasures } from '@Stec/JS/helpers';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { htmlEntities } from '@Stec/JS/helpers';
import LiveTag from './LiveTag';

import { __ } from '@wordpress/i18n';

/**
 * Note: cancelled events don't display extra tags like categories, featured, health measures etc.
 */
const EventTags = ({ event, size = '', classes = '', includeCategories = true, style, context = 'view' }) => {

    const tagsList = [];
    const isEventCancelled = event.meta.event_status === 'EventCancelled';

    if (0 === event.meta.approved) {
        tagsList.push({
            label: __('Pending Approval', 'stec'),
            color: '#fdb813'
        });
    }

    if (false === isEventCancelled) {

        if (event.meta.featured) {
            tagsList.push({
                label: [<i key='icon' className='fas fa-star' />, ' ', __('Featured', 'stec')],
                color: '#ed1c16'
            });
        }

        if (true === eventHasHealthMeasures(event)) {
            tagsList.push({
                label: [<i key={'icon'} className='fas fa-shield-virus' />, ' ', __('Health measures', 'stec')],
                color: '#0093d0'
            });
        }

    }

    switch (event.meta.event_status) {
        case 'EventPostponed':
            tagsList.push({
                label: __('Postponed', 'stec'),
                color: '#eb9534'
            });
            break;

        case 'EventRescheduled':
            tagsList.push({
                label: __('Rescheduled', 'stec'),
                color: '#eb9534'
            });
            break;

        case 'EventMovedOnline':
            tagsList.push({
                label: [<i key='icon' className='fas fa-wifi' />, ' ', __('Moved Online', 'stec')],
                color: '#32a852'
            });
            break;

        case 'EventCancelled':
            tagsList.push({
                label: __('Cancelled', 'stec'),
                color: '#f40009'
            });
            break;
    }

    if (false === isEventCancelled && true === includeCategories && Array.isArray(event.categories)) {
        event.categories.forEach((cat) => {

            tagsList.push({
                label: cat.icon ? [<i key='icon' className={cat.icon} />, ' ', cat.title] : cat.title,
                color: cat.color
            });

        });
    }

    const classNameArray = ['stec-tags-list'];

    if (size) {
        classNameArray.push(size);
    }

    if (classes) {
        classNameArray.push(classes);
    }

    if (!Array.isArray(tagsList) || tagsList.length === 0) {
        return null;
    }

    return (
        <StecDiv className={classNameArray.join(' ')} style={style}>

            <LiveTag event={event} />

            {tagsList.map((tag, i) => {

                const decodedLabel = htmlEntities(tag.label);

                return <StecSpan key={i} style={{ backgroundColor: tag.color }}>{decodedLabel}</StecSpan>;
            })}

        </StecDiv>
    )
}

export default EventTags

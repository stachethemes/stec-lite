import Column from '@Stec/CommonComponents/Column';
import ContentTabs from '@Stec/CommonComponents/ContentTabs';
import CustomHtml from '@Stec/CommonComponents/CustomHtml';
import CustomJs from '@Stec/CommonComponents/CustomJs';
import EventTags from '@Stec/CommonComponents/EventTags';
import FieldDescription from '@Stec/CommonComponents/FieldDescription';
import FieldTitle from '@Stec/CommonComponents/FieldTitle';
import Row from '@Stec/CommonComponents/Row';
import { __, _x } from '@wordpress/i18n';
import EventAttachments from './components/EventAttachments';
import EventCarousel from './components/EventCarousel';
import EventCounter from './components/EventCounter';
import EventDate from './components/EventDate';
import EventDescription from './components/EventDescription';
import EventExternalLink from './components/EventExternalLink';
import EventLocationAbout from './components/EventLocationAbout';
import EventLocationAddress from './components/EventLocationAddress';
import EventLocationDirections from './components/EventLocationDirections';
import EventLocationMap from './components/EventLocationMap';
import EventPersons from './components/EventPersons';
import EventSchedule from './components/EventSchedule';
import EventShareAndExport from './components/EventShareAndExport';
import EventTitle from './components/EventTitle';
import EventVirtualLocation from './components/EventVirtualLocation';
import HealthMeasures from './components/HealthMeasures';
import EventComments from './components/comments/EventComments';

export const getStructureComponent = (element, event = false) => {

    let Component = '';
    let componentParameters = {
        key: element.id,
        event: event,
        style: element.properties.style
    };

    if (Array.isArray(element.properties.conditions) && element.properties.conditions.length > 0) {

        for (let condition of element.properties.conditions) {

            switch (condition) {

                case 'comments': {

                    if (true !== event.comments) {
                        return null;
                    }

                    break;

                }

                case 'images': {

                    if (false === Array.isArray(event.meta.images) || event.meta.images.length <= 0) {
                        return null;
                    }

                    break;

                }

                case 'guests': {

                    if (false === Array.isArray(event.guests) || event.guests.length <= 0) {
                        return null;
                    }

                    break;

                }

                case 'organizers': {

                    if (false === Array.isArray(event.organizers) || event.organizers.length <= 0) {
                        return null;
                    }

                    break;

                }

                case 'attachments': {

                    if (false === Array.isArray(event.meta.attachments) || event.meta.attachments.length <= 0) {
                        return null;
                    }

                    break;

                }

                case 'schedule': {

                    if (false === Array.isArray(event.meta.schedule) || event.meta.schedule.length <= 0) {
                        return null;
                    }

                    break;

                }

                case 'coordinates': {

                    if (!event?.location?.coordinates) {
                        return null;
                    }

                    break;

                }

                case 'physical_location': {

                    if (event?.location?.type !== 'physical') {
                        return null;
                    }

                    break;

                }

                case 'virtual_location': {

                    if (event?.location?.type !== 'virtual') {
                        return null;
                    }

                    break;

                }

                case 'logged_in': {

                    if (!STEC_VARIABLES?.current_user?.data?.id) {
                        return null;
                    }

                    break;

                }

                case 'not_logged_in': {

                    if (STEC_VARIABLES?.current_user?.data?.id) {
                        return null;
                    }

                    break;

                }

            }

        }

    }

    switch (element.type) {

        case 'ContentTabs': {

            Component = ContentTabs;

            componentParameters.items = element.children.map(tabElement => {

                tabElement.content = tabElement.children.map(tabElementChildren => {

                    return getStructureComponent(tabElementChildren, event);

                });

                return tabElement;

            });

            break;
        }

        case 'EventOrganizers': {

            Component = EventPersons;

            componentParameters.tagLabel = __('Event organizer', 'stachethemes_event_calendar_lite');
            componentParameters.persons = event.organizers;
            componentParameters.verifiedTitle = _x('Verified organizer', 'Verified organizer title text', 'stachethemes_event_calendar_lite');

            break;
        }

        case 'EventGuests': {

            Component = EventPersons;

            componentParameters.tagLabel = __('Event guest', 'stachethemes_event_calendar_lite');
            componentParameters.persons = event.guests;

            break;
        }

        case 'CustomHtml': {

            Component = CustomHtml;

            componentParameters.html = element.properties.html;

            break;
        }

        case 'CustomJs': {

            Component = CustomJs;

            componentParameters.js = element.properties.js;

            break;
        }

        case 'Row': {
            Component = Row;
            break;
        }

        case 'Column': {
            Component = Column;
            break;
        }

        case 'FieldTitle': {

            Component = FieldTitle;

            componentParameters.text = element.properties.text;

            break;
        }

        case 'FieldDescription': {

            Component = FieldDescription;

            componentParameters.text = element.properties.textlong;

            break;
        }

        case 'EventTags': {
            Component = EventTags;
            break;
        }

        case 'EventAttachments': {
            Component = EventAttachments;
            break;
        }

        case 'EventCarousel': {
            Component = EventCarousel;
            break;
        }

        case 'Comments': {
            Component = EventComments;
            break;
        }

        case 'EventCounter': {
            Component = EventCounter;
            break;
        }

        case 'EventDescription': {
            Component = EventDescription;
            break;
        }

        case 'EventExternalLink': {
            Component = EventExternalLink;
            break;
        }

        case 'EventLocationAbout': {
            Component = EventLocationAbout;
            break;
        }

        case 'EventLocationAddress': {
            Component = EventLocationAddress;
            break;
        }

        case 'EventLocationDirections': {
            Component = EventLocationDirections;
            break;
        }

        case 'EventLocationMap': {
            Component = EventLocationMap;
            break;
        }

        case 'EventVirtualLocation': {
            Component = EventVirtualLocation;
            break;
        }

        case 'EventSchedule': {
            Component = EventSchedule;
            break;
        }

        case 'ShareAndExport': {
            Component = EventShareAndExport;
            componentParameters.items = element.properties.items;
            break;
        }

        case 'EventTitle': {
            Component = EventTitle;
            break;
        }

        case 'EventDate': {
            Component = EventDate;
            break;
        }

        case 'HealthMeasures': {
            Component = HealthMeasures;
            break;
        }

        default: {
            return null;
        }

    }

    return <Component {...componentParameters}>

        {
            element.children.map(childElement => {

                switch (element.type) {

                    case 'ContentTabs': {
                        return null; // handle from component
                    }

                    default:

                        return getStructureComponent(childElement, event);

                }


            })
        }

    </Component>

}
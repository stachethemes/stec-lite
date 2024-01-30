import EventLocationOsm from './EventLocationOsm';
import EventLocationGmap from './EventLocationGmap';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';

function EventLocationMap({ event, style }) {

    const mapType = useSettingsAtt('map__type');

    if (!event?.location?.coordinates) {
        return ''; // require coordinates to render the map
    }

    switch (mapType) {
        case 'gmap':

            return (
                <EventLocationGmap key={event.meta.start_date} event={event} style={style} />
            )


        case 'osm':
        default: {

            return (
                <EventLocationOsm key={event.meta.start_date} event={event} style={style} />
            )

        }
    }


}

export default EventLocationMap
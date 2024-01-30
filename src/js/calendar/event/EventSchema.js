import { useRef } from 'react';

const getDate = (date, timezone = 'UTC') => {

    if (date === '') {
        return '';
    }

    const momentDate = moment.tz(date, timezone);

    const schemaDate = momentDate.toISOString();

    return schemaDate;


}

const getImage = (event) => {

    if (event.meta.images.length <= 0) {
        return '';
    }

    const image = event.meta.images[0];

    return {
        "@context": "http://schema.org",
        "@type": "ImageObject",
        "contentUrl": image.sizes.full,
        "description": event.short_description || event.title,
        "name": event.title
    }
}

const getLocation = (event) => {

    if (!event.location?.type) {
        return '';
    }

    const locationType = event.location.type;

    switch (locationType) {

        case 'physical': {

            const coordinates = event.location.coordinates.split(',');
            const latitude = coordinates[0];
            const longitude = coordinates[1];

            return {
                "@context": "http://schema.org",
                "@type": "Place",
                "name": event.location.title,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": event.location.address,
                    "addressLocality": event.location.city,
                    "addressRegion": event.location.state,
                    "postalCode": event.location.postal_code,
                    "addressCountry": event.location.country
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": latitude,
                    "longitude": longitude
                },
                "description": event.location.description,

            }


        }

        case 'virtual': {

            return {
                "@context": "http://schema.org",
                "@type": "VirtualLocation",
                "name": event.location.title,
                "url": event.location.address,
                "description": event.location.description,
            }

        }

        default:
            return '';

    }

}

const getOrganizers = (event) => {

    if (event.organizers.length === 0) {
        return '';
    }

    return event.organizers.map(organizer => {

        let photo = '';

        if (organizer?.photo?.id) {
            photo = organizer.photo.sizes.full;
        }

        return {
            '@type': 'Person',
            'name': organizer.name,
            'image': photo,
            'description': organizer.description,
        }

    });

}

const getSchedule = (event) => {

    if (event.meta.schedule.length <= 0) {
        return '';
    }

    return event.meta.schedule.map(schedule => {

        return {
            "@type": "Schedule",
            "name": schedule.title,
            "startDate": getDate(schedule.start, event.meta.timezone),
            "scheduleTimezone": event.meta.timezone,
            "description": schedule.details,
        }

    });

}

const EventSchema = ({ event }) => {

    try {

        const schema = useRef(false);

        // If custom schema is set use it
        if (typeof window.stecFilterEventSchema === 'function') {

            schema.current = window.stecFilterEventSchema(event);

            return (
                <script type="application/ld+json">
                    {JSON.stringify(schema.current)}
                </script>
            )

        }

        schema.current = {
            "@context": "http://schema.org",
            "@type": "Event",
            "name": event.title,
            "description": event.short_description || event.description,
            "url": '',
            "performer": '',
            "offers": ''
        };

        schema.current.startDate = getDate(event.meta.start_date, event.meta.timezone);
        schema.current.endDate = getDate(event.meta.end_date, event.meta.timezone);

        if (event.meta.schedule.length > 0) {
            schema.current.schedule = getSchedule(event);
        }

        if (event.location?.type) {
            schema.current.location = getLocation(event);
            schema.current.eventAttendanceMode = event.location.type === 'physical' ? 'https://schema.org/OfflineEventAttendanceMode' : 'https://schema.org/OnlineEventAttendanceMode';
        }

        if (event.meta.images.length > 0) {
            schema.current.image = getImage(event);
        }

        if (event.organizers.length > 0) {
            schema.current.organizer = getOrganizers(event);
        }

        // Check if stecEventSchemaAfter is set
        if (typeof window.stecEventSchemaAfter === 'function') {
            schema.current = window.stecEventSchemaAfter(schema.current, event);
        }

        return (
            <script type="application/ld+json">
                {JSON.stringify(schema.current)}
            </script>
        )

    } catch (e) {

        return '';
    }


}

export default EventSchema;
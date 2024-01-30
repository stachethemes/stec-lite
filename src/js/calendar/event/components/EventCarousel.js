import MediaCarousel from '@Stec/CommonComponents/MediaCarousel';
import { getEventSortedImages } from '@Stec/JS/helpers';

function EventCarousel({ event, style, context = 'view' }) {

    if ('editor' === context) {
        return <MediaCarousel style={style} context={context} />
    }

    if (false === Array.isArray(event.meta.images) || event.meta.images.length <= 0) {
        return null;
    }

    const images = getEventSortedImages(event);

    return (
        <MediaCarousel images={images} style={style} />
    )
}

export default EventCarousel
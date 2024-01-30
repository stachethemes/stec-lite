import Button from '@Stec/CommonComponents/Button';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { __ } from '@wordpress/i18n';

const EventExternalLinkLive = ({ event, style }) => {

    const linksTarget = useSettingsAtt('calendar__links_target');
    const href = event.meta.external_link.url;
    const label = event.meta.external_link.text || __('Read more', 'stec');

    return <Button target={linksTarget} href={href} label={label} style={style} />

}

function EventExternalLink({ event, style, context = 'view' }) {

    if (context === 'editor') {
        return <Button label={__('Read more', 'stec')} style={style} />
    }

    if (!event.meta?.external_link?.url) {
        return null;
    }

    return <EventExternalLinkLive event={event} style={style} />

}

export default EventExternalLink
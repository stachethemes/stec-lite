import Button from '@Stec/CommonComponents/Button';
import Share from '@Stec/CommonComponents/Share';
import { useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { getEventPermalink, getGoogleCalImportLink } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

const EventShareAndExportContent = ({ event, style, items }) => {

    const hrefTarget = useSettingsAtt('calendar__links_target');

    const permalink = getEventPermalink(event);

    const allowedItems = items.filter(item => item.enabled === true).map(item => item.id);

    return (
        <StecDiv className='stec-event-share-and-export' style={style}>

            <Share
                link={permalink}
                hrefTarget={hrefTarget}
                allowedItems={allowedItems}
                eventData={event}
            />

            {
                (allowedItems.includes('googlecal')) &&

                <StecDiv className='stec-event-export'>

                    <Button
                        target={'_BLANK'}
                        href={getGoogleCalImportLink(event)}
                        label={__('Import to Google Calendar', 'stachethemes_event_calendar_lite')}
                    />

                </StecDiv>
            }

        </StecDiv>
    )

}

const EventShareAndExportDummy = ({ style }) => {

    return (
        <StecDiv className='stec-event-share-and-export' style={style}>

            <Share link={''} hrefTarget={'_blank'} context='editor' />

            <StecDiv className='stec-event-export'>

                <Button
                    target={'_BLANK'}
                    style={{ marginLeft: '5px' }}
                    label={__('Import to Google Calendar', 'stachethemes_event_calendar_lite')}
                />

            </StecDiv>

        </StecDiv>
    )

}

function EventShareAndExport({ event, style, items = [], context = 'view' }) {

    switch (context) {

        case 'editor': {
            return <EventShareAndExportDummy style={style} />
        }

        default:
            return <EventShareAndExportContent event={event} items={items} style={style} />
    }

}

export default EventShareAndExport
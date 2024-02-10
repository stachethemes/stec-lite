import FieldTitle from '@Stec/CommonComponents/FieldTitle';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';

function Pages({ settings }) {

    const settingsPages = settings.current.pages;

    return (
        <Section title={__('Pages settings', 'stachethemes_event_calendar_lite')}>

            <UncontrolledInputText
                title={__('Events single page slug', 'stachethemes_event_calendar_lite')}
                defaultValue={settingsPages.events_page_slug}
                onChange={value => {
                    settingsPages.events_page_slug = value;
                }}
            />

            <Spacer />

            <FieldTitle text={__('Note: If you make changes to these settings, you will need to refresh your permalinks. To do so, navigate to your Dashboard, click on Settings, then Permalinks, and finally click on the Save Changes button.', 'stachethemes_event_calendar_lite')} />

        </Section>
    )

}

export default Pages;
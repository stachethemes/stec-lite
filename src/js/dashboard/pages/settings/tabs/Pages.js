import FieldTitle from '@Stec/CommonComponents/FieldTitle';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';

function Pages({ settings }) {

    const settingsPages = settings.current.pages;

    return (
        <Section title={__('Pages settings', 'stec')}>

            <UncontrolledInputText
                title={__('Events single page slug', 'stec')}
                defaultValue={settingsPages.events_page_slug}
                onChange={value => {
                    settingsPages.events_page_slug = value;
                }}
            />

            <Spacer />

            <FieldTitle text={__('Note: If you make changes to these settings, you will need to refresh your permalinks. To do so, navigate to your Dashboard, click on Settings, then Permalinks, and finally click on the Save Changes button.', 'stec')} />

        </Section>
    )

}

export default Pages;
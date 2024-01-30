import { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';

function Language({ settings }) {

    const settingsLang = settings.current.lang;

    return (
        <Section>
            <SectionCollapseContent title={__('Language settings', 'stec')} subtitle={__('Show language settings', 'stec')}>

                <UncontrolledInputCheckbox
                    defaultValue={settingsLang.i18n_translate_all}
                    title={__('Enable i18n-loader.js for en_US locale', 'stec')}
                    description={__('Turn on this setting you want to load en_US .po files', 'stec')}
                    onChange={value => {
                        settingsLang.i18n_translate_all = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsLang.i18n_loader}
                    title={__('Enable i18n data loader', 'stec')}
                    description={__('Enables i18n-loader.js to load .po files if available.', 'stec')}
                    onChange={value => {
                        settingsLang.i18n_loader = value;
                    }}
                />

            </SectionCollapseContent>

        </Section>
    )
}

export default Language;
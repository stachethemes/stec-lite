import { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';
import MaybeFilter from '../../../MaybeFilter';
import { getPropsKeywords, getSectionKeywords } from '../filterMap';

function Language({ settings, searchValue }) {

    const settingsLang = settings.current.lang;

    return (
        <Section>

            <MaybeFilter searchValue={searchValue} keywords={getSectionKeywords('language', 'language')}>
                <SectionCollapseContent title={__('Language settings', 'stachethemes_event_calendar_lite')} subtitle={__('Show language settings', 'stachethemes_event_calendar_lite')}>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('language', 'language', 'i18n_translate_all')}>
                        <UncontrolledInputCheckbox
                            defaultValue={settingsLang.i18n_translate_all}
                            title={__('Enable i18n-loader.js for en_US locale', 'stachethemes_event_calendar_lite')}
                            description={__('Turn on this setting if you want to load en_US .po files', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsLang.i18n_translate_all = value;
                            }}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('language', 'language', 'i18n_loader')}>

                        <UncontrolledInputCheckbox
                            defaultValue={settingsLang.i18n_loader}
                            title={__('Enable i18n data loader', 'stachethemes_event_calendar_lite')}
                            description={__('Enables i18n-loader.js to load .po files if available.', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsLang.i18n_loader = value;
                            }}
                        />

                    </MaybeFilter>

                </SectionCollapseContent>
            </MaybeFilter>
        </Section>
    )
}

export default Language;
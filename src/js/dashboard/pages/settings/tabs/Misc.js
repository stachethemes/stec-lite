import FieldDescription from '@Stec/CommonComponents/FieldDescription';
import InputCheckbox, { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __, sprintf } from '@wordpress/i18n';
import { useState } from 'react';

const ForceLoad = ({ settingsMisc }) => {

    const [enabled, setEnabled] = useState(settingsMisc.force_load_enabled);

    return (
        <>

            <Spacer />

            <InputCheckbox
                value={enabled}
                title={__('Enable force load scripts', 'stec')}
                onChange={value => {
                    settingsMisc.force_load_enabled = value;
                    setEnabled(value ? true : false);
                }}
            />

            {enabled && <>
                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.force_stec_scripts}
                    title={__('Force load [stec] scripts ', 'stec')}
                    placeholder={'101,102,103...'}
                    description={__('Page ids. Comma separated id values', 'stec')}
                    onChange={value => {
                        settingsMisc.force_stec_scripts = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.force_stec_events_slider_scripts}
                    title={__('Force load [stec_events_slider] scripts ', 'stec')}
                    placeholder={'101,102,103...'}
                    description={__('Page ids. Comma separated id values', 'stec')}
                    onChange={value => {
                        settingsMisc.force_stec_events_slider_scripts = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.force_stec_events_list_scripts}
                    title={__('Force load [stec_events_list] scripts ', 'stec')}
                    placeholder={'101,102,103...'}
                    description={__('Page ids. Comma separated id values', 'stec')}
                    onChange={value => {
                        settingsMisc.force_stec_events_list_scripts = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.force_stec_submit_form_scripts}
                    title={__('Force load [stec_submit_form] scripts ', 'stec')}
                    placeholder={'101,102,103...'}
                    description={__('Page ids. Comma separated id values', 'stec')}
                    onChange={value => {
                        settingsMisc.force_stec_submit_form_scripts = value;
                    }}
                />

            </>}

        </>
    )
}

const TinyMceSettings = ({ settingsMisc }) => {

    const [enabled, setEnabled] = useState(settingsMisc.tiny_mce_enabled);

    return (

        <>
            <InputCheckbox
                value={enabled}
                title={__('Enable TinyMCE rich text editor', 'stec')}
                onChange={value => {
                    settingsMisc.tiny_mce_enabled = value;
                    setEnabled(value ? true : false);
                }}
            />

            {enabled && <>
                <Spacer />
                <UncontrolledInputText
                    defaultValue={settingsMisc.tiny_mce_api_key}
                    title={__('TinyMCE API key', 'stec')}
                    onChange={value => {
                        settingsMisc.tiny_mce_api_key = value;
                    }}
                />

                <FieldDescription
                    allowHtml={true}
                    text={sprintf(__('Get your API key from %s', 'stec'),
                        '<a target="_blank" href="https://www.tiny.cloud/">https://www.tiny.cloud/</a>')}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.tiny_mce_src}
                    title={__('TinyMCE Custom Script Source', 'stec')}
                    onChange={value => {
                        settingsMisc.tiny_mce_src = value;
                    }}
                    description={__('If you have a custom TinyMCE script, enter the source URL here', 'stec')}
                />
            </>
            }
        </>

    )

}

function Misc({ settings }) {

    const settingsMisc = settings.current.misc;

    return (
        <Section>
            <SectionCollapseContent title={__('Miscellaneous settings', 'stec')} subtitle={__('Show misc settings', 'stec')}>

                <UncontrolledInputCheckbox
                    defaultValue={settingsMisc.keep_data}
                    title={__('Keep plugin data on uninstall', 'stec')}
                    onChange={value => {
                        settingsMisc.keep_data = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.events_per_request}
                    title={__('Events fetch limit', 'stec')}
                    description={__('Number of events to fetch per request (1 to 500)', 'stec')}
                    onChange={value => {
                        settingsMisc.events_per_request = value
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsMisc.events_prefetch}
                    title={__('Prefetch events', 'stec')}
                    description={__('Prefetch events on page load', 'stec')}
                    onChange={value => {
                        settingsMisc.events_prefetch = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsMisc.ajax_nonce}
                    title={__('Ajax Nonce', 'stec')}
                    description={__('Request the rest api nonce via ajax', 'stec')}
                    onChange={value => {
                        settingsMisc.ajax_nonce = value;
                    }}
                />


                <Spacer />

                <TinyMceSettings settingsMisc={settingsMisc} />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsMisc.font_awesome}
                    title={__('Load Font-Awesome', 'stec')}
                    onChange={value => {
                        settingsMisc.font_awesome = value;
                    }}
                />

                <Spacer />

                <ForceLoad settingsMisc={settingsMisc} />

            </SectionCollapseContent>
        </Section >


    )
}

export default Misc;
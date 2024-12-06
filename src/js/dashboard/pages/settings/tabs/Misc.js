import FieldDescription from '@Stec/CommonComponents/FieldDescription';
import InputCheckbox, { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import InputText, { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledQtySelector } from '@Stec/CommonComponents/QtySelector';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __, sprintf } from '@wordpress/i18n';
import { useState } from 'react';
import MaybeFilter from '../../../MaybeFilter';
import { getPropsKeywords, getSectionKeywords } from '../filterMap';

const ForceLoad = ({ searchValue, settingsMisc }) => {

    const [enabled, setEnabled] = useState(settingsMisc.force_load_enabled);

    return (
        <>

            <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('misc', 'misc', 'force_load_enabled')}>

                <Spacer />

                <InputCheckbox
                    value={enabled}
                    title={__('Enable force load scripts', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsMisc.force_load_enabled = value;
                        setEnabled(value ? true : false);
                    }}
                />

            </MaybeFilter>

            {enabled && <>


                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.force_stec_scripts}
                    title={__('Force load [stec] scripts ', 'stachethemes_event_calendar_lite')}
                    placeholder={''}
                    description={__('Page ids. Comma separated id values', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsMisc.force_stec_scripts = value;
                    }}
                />



                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.force_stec_events_slider_scripts}
                    title={__('Force load [stec_events_slider] scripts ', 'stachethemes_event_calendar_lite')}
                    placeholder={''}
                    description={__('Page ids. Comma separated id values', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsMisc.force_stec_events_slider_scripts = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.force_stec_events_list_scripts}
                    title={__('Force load [stec_events_list] scripts ', 'stachethemes_event_calendar_lite')}
                    placeholder={''}
                    description={__('Page ids. Comma separated id values', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsMisc.force_stec_events_list_scripts = value;
                    }}
                />

                <Spacer />

                <UncontrolledInputText
                    defaultValue={settingsMisc.force_stec_submit_form_scripts}
                    title={__('Force load [stec_submit_form] scripts ', 'stachethemes_event_calendar_lite')}
                    placeholder={''}
                    description={__('Page ids. Comma separated id values', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsMisc.force_stec_submit_form_scripts = value;
                    }}
                />

            </>}

        </>
    )
}

const TinyMceSettings = ({ searchValue, settingsMisc }) => {

    const [enabled, setEnabled] = useState(settingsMisc.tiny_mce_enabled);
    const [tinyMceSource, setTinyMceSource] = useState(settingsMisc.tiny_mce_src);

    return (

        <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('misc', 'misc', 'tiny_mce_enabled')}>

            <InputCheckbox
                value={enabled}
                title={__('Enable TinyMCE rich text editor', 'stachethemes_event_calendar_lite')}
                onChange={value => {
                    settingsMisc.tiny_mce_enabled = value;
                    setEnabled(value ? true : false);
                }}
            />


            {enabled && <>

                <Spacer />

                <InputText
                    value={tinyMceSource}
                    title={__('TinyMCE Custom Script Source', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        setTinyMceSource(value);
                        settingsMisc.tiny_mce_src = value;
                    }}
                    description={__('If you have a custom TinyMCE script, enter the source URL here or type "cdn" to load from the Tiny CDN', 'stachethemes_event_calendar_lite')}
                />

                {
                    tinyMceSource === 'cdn' && <>


                        <Spacer />

                        <UncontrolledInputText
                            defaultValue={settingsMisc.tiny_mce_api_key}
                            title={__('TinyMCE API key', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsMisc.tiny_mce_api_key = value;
                            }}
                        />

                        <FieldDescription
                            allowHtml={true}
                            text={sprintf(__('Get your API key from %s', 'stachethemes_event_calendar_lite'),
                                '<a target="_blank" href="https://www.tiny.cloud/">https://www.tiny.cloud/</a>')}
                        />

                    </>
                }

            </>
            }

            <Spacer />
        </MaybeFilter>

    )

}

function Misc({ settings, searchValue }) {

    const settingsMisc = settings.current.misc;

    return (
        <Section>
            <MaybeFilter searchValue={searchValue} keywords={getSectionKeywords('misc', 'misc')}>
                <SectionCollapseContent title={__('Miscellaneous settings', 'stachethemes_event_calendar_lite')} subtitle={__('Show misc settings', 'stachethemes_event_calendar_lite')}>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('misc', 'misc', 'keep_data')}>
                        <UncontrolledInputCheckbox
                            defaultValue={settingsMisc.keep_data}
                            title={__('Keep plugin data on uninstall', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsMisc.keep_data = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('misc', 'misc', 'events_per_request')}>
                        <UncontrolledQtySelector
                            title={__('Events fetch limit', 'stachethemes_event_calendar_lite')}
                            min={1}
                            max={500}
                            defaultValue={settingsMisc.events_per_request}
                            onChange={value => {
                                settingsMisc.events_per_request = value;
                            }}
                            description={__('Number of events to fetch per request (1 to 500)', 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('misc', 'misc', 'events_prefetch')}>
                        <UncontrolledInputCheckbox
                            defaultValue={settingsMisc.events_prefetch}
                            title={__('Prefetch events', 'stachethemes_event_calendar_lite')}
                            description={__('Prefetch events on page load', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsMisc.events_prefetch = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('misc', 'misc', 'ajax_nonce')}>
                        <UncontrolledInputCheckbox
                            defaultValue={settingsMisc.ajax_nonce}
                            title={__('Ajax Nonce', 'stachethemes_event_calendar_lite')}
                            description={__('Request the rest api nonce via ajax', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsMisc.ajax_nonce = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <TinyMceSettings searchValue={searchValue} settingsMisc={settingsMisc} />

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('misc', 'misc', 'noanim')}>
                        <UncontrolledInputCheckbox
                            defaultValue={settingsMisc.noanim}
                            title={__('Disable accordion animation', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsMisc.noanim = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>
                    
                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('misc', 'misc', 'font_awesome')}>
                        <UncontrolledInputCheckbox
                            defaultValue={settingsMisc.font_awesome}
                            title={__('Load Font-Awesome', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsMisc.font_awesome = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('misc', 'misc', 'upload_images')}>
                        <UncontrolledInputCheckbox
                            defaultValue={settingsMisc.upload_images}
                            title={__('Allow anonymous users to upload images', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsMisc.upload_images = value;
                            }}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <ForceLoad searchValue={searchValue} settingsMisc={settingsMisc} />

                </SectionCollapseContent>
            </MaybeFilter>
            <Spacer />
        </Section >


    )
}

export default Misc;
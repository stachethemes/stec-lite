import InputSelect from '@Stec/CommonComponents/InputSelect';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

function Comments({ settings }) {

    const settingsComments = settings.current.comments;
    const [type, setType] = useState(settingsComments.type);

    return (
        <Section>
            <SectionCollapseContent title={__('Comments settings', 'stachethemes_event_calendar_lite')} subtitle={__('Show comments settings', 'stachethemes_event_calendar_lite')}>

                <InputSelect
                    title={__('Comments form type', 'stachethemes_event_calendar_lite')}
                    description={__('Choose default form', 'stachethemes_event_calendar_lite')}
                    value={type}
                    options={[
                        {
                            value: 'internal',
                            label: __('Internal', 'stachethemes_event_calendar_lite')
                        },
                        {
                            value: 'facebook',
                            label: __('Facebook', 'stachethemes_event_calendar_lite')
                        },
                    ]}
                    onChange={value => {
                        settingsComments.type = value;
                        setType(value);
                    }}
                />

                {
                    type === 'facebook' &&

                    <>
                        <Spacer />

                        <UncontrolledInputText
                            title={__('Facebook App ID', 'stachethemes_event_calendar_lite')}
                            defaultValue={settingsComments.fb_app_id}
                            onChange={value => {
                                settingsComments.fb_app_id = value;
                            }}
                        />
                    </>
                }




            </SectionCollapseContent>
        </Section >
    )
}

export default Comments;
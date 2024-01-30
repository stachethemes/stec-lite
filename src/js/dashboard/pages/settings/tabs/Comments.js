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
            <SectionCollapseContent title={__('Comments settings', 'stec')} subtitle={__('Show comments settings', 'stec')}>

                <InputSelect
                    title={__('Comments form type', 'stec')}
                    description={__('Choose default form', 'stec')}
                    value={type}
                    options={[
                        {
                            value: 'internal',
                            label: __('Internal', 'stec')
                        },
                        {
                            value: 'facebook',
                            label: __('Facebook', 'stec')
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
                            title={__('Facebook App ID', 'stec')}
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
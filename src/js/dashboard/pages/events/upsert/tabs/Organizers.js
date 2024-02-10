import Button from '@Stec/CommonComponents/Button';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import Modal from '@Stec/CommonComponents/Modal';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import { flushApiCache } from '@Stec/JS/api';
import { UpsertForm } from '@Stec/JS/dashboard/pages/organizers/Upsert';
import { useTaxonomyItemsAll } from '@Stec/JS/hooks';
import { __ } from '@wordpress/i18n';
import { uniqueId } from 'lodash';
import { useState } from 'react';

const SelectFromList = ({ postData }) => {

    const { items: organizers, ready: organizersReady, error: organizersError } = useTaxonomyItemsAll({
        perPage: 100,
        permissionType: 'use_permission',
        taxonomy: 'stec_org'
    });

    if (true !== organizersReady || true === organizersError) {
        return null;
    }

    return (

        <UncontrolledInputSelect
            title={__('Select organizers', 'stachethemes_event_calendar_lite')}
            multiple={true}
            description={__('Select existing organizers', 'stachethemes_event_calendar_lite')}
            defaultValue={postData.current.stec_org}
            options={organizers.map(item => {
                return (
                    {
                        value: item.id,
                        label: item.name,
                        color: item.meta.color
                    }
                )
            })}
            onChange={value => {
                postData.current.stec_org = value;
            }}
        />


    )
}

const Organizers = (props) => {

    const [listKey, setListKey] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const postData = props.postData;

    const refreshList = () => {
        flushApiCache({
            group: 'taxonomy-stec_org'
        });
        setListKey(uniqueId());
    }

    return (

        <>

            <Modal isOpen={modalOpen} onClose={() => {
                setModalOpen(false);
            }}>
                <UpsertForm

                    template={false}

                    onBack={() => {

                        setModalOpen(false);

                    }}

                    onOrganizerInserted={(item) => {

                        if (false === Array.isArray(postData.current.stec_org)) {
                            postData.current.stec_org = [];
                        }

                        if (false === postData.current.stec_org.some(organizerId => item.id === organizerId)) {
                            postData.current.stec_org = [...postData.current.stec_org, ...[item.id]];
                        }

                        refreshList();

                    }}

                    onOrganizerDeleted={(item) => {

                        if (false === Array.isArray(postData.current.stec_org)) {
                            postData.current.stec_org = [];
                        }

                        postData.current.stec_org = postData.current.stec_org.filter(organizerId => {

                            return organizerId !== item.id;

                        });

                        refreshList();

                    }}
                />

            </Modal>

            <Section title={__('Organizers list', 'stachethemes_event_calendar_lite')}>

                <SelectFromList key={listKey} postData={postData} />

                <Spacer />

                <Button
                    disabled={!STEC_VARIABLES.current_user.capability.manage_terms}
                    label={[<i key='icon' className='fa-solid fa-plus' />, __('Add new organizer', 'stachethemes_event_calendar_lite')]}
                    className='blue'
                    onClick={() => {

                        if (!STEC_VARIABLES.current_user.capability.manage_terms) {
                            return false;
                        }

                        setModalOpen(true)
                    }}
                />

            </Section>
        </>
    )

}


export default Organizers
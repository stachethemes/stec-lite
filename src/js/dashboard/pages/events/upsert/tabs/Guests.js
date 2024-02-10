import Button from '@Stec/CommonComponents/Button';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import Modal from '@Stec/CommonComponents/Modal';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import { flushApiCache } from '@Stec/JS/api';
import { UpsertForm } from '@Stec/JS/dashboard/pages/guests/Upsert';
import { useTaxonomyItemsAll } from '@Stec/JS/hooks';
import { __ } from '@wordpress/i18n';
import { uniqueId } from 'lodash';
import { useState } from 'react';

const SelectFromList = ({ postData }) => {

    const { items: guests, ready: guestsReady, error: guestsError } = useTaxonomyItemsAll({
        perPage: 100,
        permissionType: 'use_permission',
        taxonomy: 'stec_gst'
    });

    if (true !== guestsReady || true === guestsError) {
        return null;
    }

    return (
        <UncontrolledInputSelect
            title={__('Select guests', 'stachethemes_event_calendar_lite')}
            multiple={true}
            description={__('Select existing guests', 'stachethemes_event_calendar_lite')}
            defaultValue={postData.current.stec_gst}
            options={guests.map(item => {
                return (
                    {
                        value: item.id,
                        label: item.name,
                        color: item.meta.color
                    }
                )
            })}
            onChange={value => {
                postData.current.stec_gst = value;
            }}
        />

    )
}

const Guests = (props) => {

    const [listKey, setListKey] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const postData = props.postData;

    const refreshList = () => {
        flushApiCache({
            group: 'taxonomy-stec_gst'
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

                    onGuestInserted={(item) => {

                        if (false === Array.isArray(postData.current.stec_gst)) {
                            postData.current.stec_gst = [];
                        }

                        if (false === postData.current.stec_gst.some(guestId => item.id === guestId)) {
                            postData.current.stec_gst = [...postData.current.stec_gst, ...[item.id]];
                        }

                        refreshList();

                    }}

                    onGuestDeleted={(item) => {

                        if (false === Array.isArray(postData.current.stec_gst)) {
                            postData.current.stec_gst = [];
                        }

                        postData.current.stec_gst = postData.current.stec_gst.filter(guestId => {

                            return guestId !== item.id;

                        });

                        refreshList();

                    }}
                />

            </Modal>

            <Section title={__('Guests list', 'stachethemes_event_calendar_lite')}>

                <SelectFromList key={listKey} postData={postData} />

                <Spacer />

                <Button
                    disabled={!STEC_VARIABLES.current_user.capability.manage_terms}
                    label={[<i key='icon' className='fa-solid fa-plus' />, __('Add new guest', 'stachethemes_event_calendar_lite')]}
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


export default Guests
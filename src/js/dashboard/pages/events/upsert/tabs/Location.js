import Button from '@Stec/CommonComponents/Button';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import Modal from '@Stec/CommonComponents/Modal';
import Section from '@Stec/CommonComponents/Section';
import Spacer from '@Stec/CommonComponents/Spacer';
import { flushApiCache } from '@Stec/JS/api';
import { UpsertForm } from '@Stec/JS/dashboard/pages/locations/Upsert';
import { useTaxonomyItemsAll } from '@Stec/JS/hooks';
import { __ } from '@wordpress/i18n';
import { uniqueId } from 'lodash';
import { useState } from 'react';

const SelectFromList = ({ postData }) => {

    const { items: locations, ready: locationsReady, error: locationsError } = useTaxonomyItemsAll({
        perPage: 100,
        permissionType: 'use_permission',
        taxonomy: 'stec_loc'
    });

    if (true !== locationsReady || true === locationsError) {
        return null;
    }

    const listLocation = locations.map(item => {
        return (
            {
                value: item.id,
                label: item.name,
            }
        )
    });

    listLocation.unshift({
        value: '',
        label: __('None', 'stachethemes_event_calendar_lite'),
    });

    return (

        <UncontrolledInputSelect
            title={__('Select location', 'stachethemes_event_calendar_lite')}
            description={__('Select existing locations', 'stachethemes_event_calendar_lite')}
            defaultValue={postData.current.stec_loc}
            options={listLocation}
            onChange={value => {
                postData.current.stec_loc = value;
            }}
        />

    )
}

const Locations = (props) => {

    const [listKey, setListKey] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const postData = props.postData;

    const refreshList = () => {
        flushApiCache({
            group: 'taxonomy-stec_loc'
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

                    onLocationInserted={(item) => {

                        postData.current.stec_loc = item.id;

                        refreshList();

                    }}

                    onLocationDeleted={(item) => {

                        postData.current.stec_loc = [];

                        refreshList();

                    }}
                />

            </Modal>

            <Section title={__('Locations list', 'stachethemes_event_calendar_lite')}>

                <SelectFromList key={listKey} postData={postData} />

                <Spacer />

                <Button
                    disabled={!STEC_VARIABLES.current_user.capability.manage_locations}
                    label={[<i key='icon' className='fa-solid fa-plus' />, __('Add new location', 'stachethemes_event_calendar_lite')]}
                    className='blue'
                    onClick={() => {

                        if (!STEC_VARIABLES.current_user.capability.manage_locations) {
                            return false;
                        }

                        setModalOpen(true)
                    }}
                />

            </Section>
        </>
    )

}


export default Locations
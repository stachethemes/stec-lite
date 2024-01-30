import { UncontrolledDelayedInputText } from '@Stec/CommonComponents/InputText';
import ListManager from '@Stec/CommonComponents/ListManager';
import { flushApiCache, newApiDelete, newApiPost } from "@Stec/JS/api";
import { useDashboardMenu } from '@Stec/JS/dashboard/hooks.js';
import { useTaxonomyItems } from '@Stec/JS/hooks';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { cloneDeep } from 'lodash';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const ManageTermsReady = (props) => {

    // Used for preventing spamming ajax calls
    const blockActionRef = useRef(false);

    // active menu dispatcher
    const { activeMenuParams: params, setActiveMenu } = useDashboardMenu();

    // Initial query args
    const initialQueryArgs = params.initialQueryArgs || {
        page: 1,
        perPage: 10,
        permissionType: 'edit_permission',
        taxonomy: props.taxonomyName,
        search: ''
    };

    // Assigns taxonomy query args
    const [taxonomyQueryArgs, setTaxonomyQueryArgs] = useState(initialQueryArgs);

    // Queries requested taxonomy
    const { items, totalPages, ready, error } = useTaxonomyItems(taxonomyQueryArgs);

    const [checkedItems, setCheckedItems] = useState([]);

    // Navigates to edit page
    const editTerm = (id) => {

        const editItem = items.filter((filterItem) => {
            return filterItem.id === id;
        })[0];

        setActiveMenu({
            page: props.upsertPageId,
            params: {
                template: editItem,
                manageListQueryArgs: { ...taxonomyQueryArgs }
            }
        });
    }

    // Delete calendar by id
    const deleteTerm = (id) => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stec'));
            return;
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function deleteItem() {

                    try {

                        const result = await newApiDelete({
                            route: props.restUrl,
                            args: id,
                        });

                        flushApiCache({
                            group: `taxonomy-${props.taxonomy}`
                        });

                        setCheckedItems([]);

                        setTaxonomyQueryArgs(state => {
                            return {
                                ...state,
                                page: 1,
                                seed: Date.now()
                            }
                        });

                        return resolve(__('Deleted', 'stec'));

                    } catch (e) {

                        return reject(e.message);
                    }


                }

                deleteItem();

            }),
            {
                loading: __('Deleting', 'stec'),

                success: (successMessage) => {

                    blockActionRef.current = false;

                    return successMessage;
                },

                error: (errorMessage) => {

                    blockActionRef.current = false;

                    return errorMessage;
                },
            }
        );
    }

    // Duplicate term
    const duplicateTerm = (id) => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stec'));
            return;
        }

        const foundTerm = items.find(item => item.id === id);

        if (!foundTerm) {
            toast.error(__('Term not found', 'stec'));
            return;
        }

        const termDuplicateData = cloneDeep(foundTerm);
        const duplicateTimestamp = Date.now();

        delete termDuplicateData.id;
        delete termDuplicateData.slug;
        delete termDuplicateData.link;

        // Check if the name follows the pattern: duplicate-<timestamp> and remove it
        // this is to prevent duplicate-<timestamp> (duplicate-<timestamp>) (duplicate-<timestamp>) etc...
        if (/\(duplicate-\d+\)/.test(termDuplicateData.name)) {
            termDuplicateData.name = termDuplicateData.name.replace(/\(duplicate-\d+\)/g, '');
        }

        termDuplicateData.name = `${termDuplicateData.name} (duplicate-${duplicateTimestamp})`;

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function duplicateItem() {

                    try {

                        const result = await newApiPost({
                            route: props.restUrl,
                            data: termDuplicateData,
                            includeResponseStatus: true
                        });

                        const { status, data } = result;

                        switch (status) {

                            case 201:

                                setTaxonomyQueryArgs(state => {
                                    return {
                                        ...state, seed: Date.now()
                                    }
                                });

                                return resolve(__('Duplicated', 'stec'));

                            default:

                                return reject(__(`Sorry, something went wrong`, 'stec'));

                        }

                    } catch (e) {
                        return reject(e.message);
                    }


                }

                duplicateItem();

            }),
            {
                loading: __('Duplicating', 'stec'),

                success: (successMessage) => {

                    blockActionRef.current = false;

                    return successMessage;
                },

                error: (errorMessage) => {

                    blockActionRef.current = false;

                    return errorMessage;
                },
            }
        );
    }

    // Bulk deletes selected items (basically loop deletes items)
    const deleteSelectedItems = () => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stec'));
            return;
        }

        if (checkedItems.length <= 0) {
            return toast.error(__('No items selected', 'stec'));
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function bulkDelete() {

                    try {

                        for await (let id of checkedItems) {

                            const result = await newApiDelete({
                                route: props.restUrl,
                                args: `${id}?force=true`,
                            });

                        }

                        flushApiCache({
                            group: `taxonomy-${props.taxonomy}`
                        });

                        setCheckedItems([]);

                        setTaxonomyQueryArgs(state => {
                            return {
                                ...state,
                                page: 1,
                                seed: Date.now()
                            }
                        });

                        return resolve(__('Items deleted', 'stec'));

                    } catch (e) {
                        return reject(e.message);
                    }

                }

                bulkDelete();
            }),
            {
                loading: __('Deleting items', 'stec'),
                success: (successMessage) => {

                    blockActionRef.current = false;

                    return successMessage
                },
                error: (errorMessage) => {

                    blockActionRef.current = false;

                    return errorMessage
                },
            }
        );

    }

    // On pagination page change
    const onPageChange = (page) => {
        setCheckedItems([]);
        setTaxonomyQueryArgs({
            ...taxonomyQueryArgs, page: page
        });
    }

    // List manager top level controls
    const listManagerControls = [
        {
            id: 'select-all',
            label: __('Select all', 'stec'),
            onClick: () => {

                if (checkedItems.length === items.length) {
                    setCheckedItems([]);
                } else {
                    setCheckedItems(items.map(item => item.id));
                }
            },
            type: 'checkbox',
            checked: checkedItems.length > 0 && checkedItems.length === items.length
        },
        {
            id: 'delete',
            color: 'red',
            label: [<i key='icon' className='fa-solid fa-trash' />, __('Delete', 'stec')],
            onClick: () => {
                deleteSelectedItems();
            }
        }
    ];

    // List manager items controls
    const itemControls = [
        {
            id: 'select-item',
            onClick: (itemId) => {
                if (checkedItems.some(id => itemId === id)) {
                    setCheckedItems(checkedItems.filter(id => id !== itemId));
                } else {
                    setCheckedItems([...checkedItems, itemId]);
                }
            },
        },
        {
            id: 'title',
            onClick: (id) => {
                editTerm(id);
            }
        },
        {
            id: 'duplicate',
            color: 'blue',
            icon: <i key='icon' className='fa-solid fa-clone' />,
            label: __('Duplicate', 'stec'),
            onClick: (id) => {
                duplicateTerm(id);
            }
        },
        {
            id: 'edit',
            color: 'blue',
            icon: <i key='icon' className='fa-solid fa-edit' />,
            label: __('Edit', 'stec'),
            onClick: (id) => {
                editTerm(id);
            }
        },
        {
            id: 'delete',
            color: 'red',
            icon: <i key='icon' className='fa-solid fa-trash' />,
            label: __('Delete', 'stec'),
            onClick: (id) => {
                deleteTerm(id);
            }
        }
    ];

    // Map items to fit List manager item props
    const listItems = items.map(item => props.itemsMap(item, itemControls, checkedItems, blockActionRef));

    props.hasItemsRef.current = items.length > 0;

    return (

        <>
            <StecDiv className='stec-manage-list-filterss stec-manage-list-filterss-taxonomies'>

                <StecDiv className='stec-manage-list-filterss-buttons' />

                <UncontrolledDelayedInputText
                    placeholder={__('Search', 'stec')}
                    defaultValue={taxonomyQueryArgs.search || ''}
                    onChange={value => {

                        setTaxonomyQueryArgs(
                            { ...taxonomyQueryArgs, search: value, page: 1 }
                        );

                    }}
                />

            </StecDiv>

            <ListManager
                controls={listManagerControls}
                totalPages={totalPages}
                currentPage={taxonomyQueryArgs.page}
                onPageChange={page => {
                    onPageChange(page);
                }}
                items={listItems}
                ready={ready}
            />


        </>
    )


}

function ManageTerms(props) {

    const [instance, setInstance] = useState(0);

    return <ManageTermsReady key={instance} {...props} resetInstance={() => {
        setInstance(Date.now());
    }} />

}

export default ManageTerms
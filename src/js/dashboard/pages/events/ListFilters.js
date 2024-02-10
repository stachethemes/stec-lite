import { UncontrolledDatePicker } from '@Stec/CommonComponents/DatePicker';
import { UncontrolledDelayedInputText } from '@Stec/CommonComponents/InputText';
import Loader from '@Stec/CommonComponents/Loader';
import { useOutsideHandler, useTaxonomyItemsAll } from '@Stec/JS/hooks';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { __, sprintf } from '@wordpress/i18n';
import { cloneDeep } from 'lodash';
import { useRef, useState } from 'react';

const FilterByTaxonomyItemsWithTaxonomyReady = ({ selectedItems, activeItems, taxonomyItems, onChange }) => {

    let selectedItemsArray = [];
    let activeItemsArray = [];

    if (activeItems) {
        activeItemsArray = activeItems.split(',').map(item => parseInt(item, 10) || '');
    }

    if (selectedItems) {
        selectedItemsArray = selectedItems.split(',').map(item => parseInt(item, 10) || '');
    }

    const initialItems = taxonomyItems.map(item => {

        if (activeItemsArray.includes(item.value) || selectedItemsArray.includes(item.value)) {
            item.active = true;
        }

        return item;
    });

    const [items, setItems] = useState(initialItems);

    const onClick = (item) => {

        const newState = cloneDeep(items);

        newState.forEach(newItem => {
            if (newItem.value === item.value) {
                newItem.active = !item.active;
            }
            return newItem;
        });

        setItems(newState);

        onChange(newState);
    }

    return (
        <StecDiv className='stec-manage-list-filters-dropdown-wrap'>
            {
                items.map(item => {

                    let classNameArray = [];
                    const isActiveFilter = activeItemsArray.includes(item.value);

                    if (item.active) {
                        classNameArray.push('fa-solid fa-square-check');
                    } else {
                        classNameArray.push('fa-regular fa-square');
                    }

                    if (isActiveFilter) {
                        classNameArray.push('is-active-filter');
                    }

                    return (
                        <StecDiv key={item.value} className='stec-manage-list-filters-dropdown-item' onClick={() => {
                            onClick(item);
                        }}>
                            <i className={classNameArray.join(' ')} />
                            <StecSpan>{item.label}</StecSpan>
                        </StecDiv>
                    )
                })
            }
        </StecDiv>
    )

}

const FilterByTaxonomyItems = ({ activeItems, selectedItems, taxonomy, onChange }) => {

    const { items: taxItems, ready: itemsReady, error: itemsError } = useTaxonomyItemsAll({
        perPage: 100,
        permissionType: 'read_permission',
        taxonomy: taxonomy
    });

    if (itemsReady === false) {
        return <Loader type="small-wide" title={__('Refreshing list', 'stachethemes_event_calendar_lite')} style={{
            padding: 10
        }} />
    }

    if (itemsError) {
        return null;
    }

    const items = taxItems.map(item => {
        return {
            label: item.name,
            value: item.id,
            active: false
        }
    });

    const itemsWithUnassignedOption = [{
        label: __('Unassigned', 'stachethemes_event_calendar_lite'),
        value: -1,
        active: false
    }, ...items];

    return <FilterByTaxonomyItemsWithTaxonomyReady selectedItems={selectedItems} activeItems={activeItems} taxonomyItems={itemsWithUnassignedOption} onChange={onChange} />;
}

const FilterByTaxonomy = ({ label, icon, taxonomy, selectedItems, activeItems, onChange }) => {

    const itemRef = useRef(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useOutsideHandler(itemRef, () => {
        setShowDropdown(false);
    });

    const hasActiveItems = !!activeItems; // boolean

    return (
        <StecDiv className={`stec-manage-list-filters ${showDropdown ? 'active' : ''} ${hasActiveItems ? 'has-active-items' : ''}`} ref={itemRef}
            title={sprintf(__('Filter by %s', 'stachethemes_event_calendar_lite'), label)}
            onClick={() => {
                setShowDropdown(!showDropdown)
            }}>
            <i className={icon} />

            {
                showDropdown &&
                <StecDiv className='stec-manage-list-filters-dropdown' onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <StecDiv className='stec-manage-list-filters-dropdown-label'>
                        {sprintf(__('Filter by %s', 'stachethemes_event_calendar_lite'), label)}
                    </StecDiv>

                    <FilterByTaxonomyItems selectedItems={selectedItems} activeItems={activeItems} taxonomy={taxonomy} onChange={onChange} />

                </StecDiv>
            }
        </StecDiv>
    )

}

const FilterByDates = ({ label, icon, values, activeValues, onChange }) => {

    const itemRef = useRef(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useOutsideHandler(itemRef, () => {
        setShowDropdown(false);
    });

    const hasActiveItems = activeValues?.maxDate || activeValues?.minDate;

    return (
        <StecDiv className={`stec-manage-list-filters ${showDropdown ? 'active' : ''} ${hasActiveItems ? 'has-active-items' : ''}`} ref={itemRef}
            title={sprintf(__('Filter by %s', 'stachethemes_event_calendar_lite'), label)}
            onClick={() => {
                setShowDropdown(!showDropdown)
            }}>
            <i className={icon} />

            {
                showDropdown &&
                <StecDiv className='stec-manage-list-filters-dropdown' onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <StecDiv className='stec-manage-list-filters-dropdown-label'>
                        {sprintf(__('Filter by %s', 'stachethemes_event_calendar_lite'), label)}
                    </StecDiv>

                    <UncontrolledDatePicker
                        includeTime={false}
                        title={__('Min date', 'stachethemes_event_calendar_lite')}
                        defaultValue={values?.minDate || ''}
                        onChange={value => {
                            onChange({
                                key: 'min_date',
                                value: value
                            });
                        }}
                    />

                    <UncontrolledDatePicker
                        includeTime={false}
                        title={__('Max date', 'stachethemes_event_calendar_lite')}
                        defaultValue={values?.maxDate || ''}
                        onChange={value => {
                            onChange({
                                key: 'max_date',
                                value: value
                            });
                        }}
                    />

                </StecDiv>
            }
        </StecDiv>
    )
}

function ListFilters(props) {

    const { calendar, category, location, organizer, guest, search, min_date, max_date } = props.postQueryArgs;

    const [args, setArgs] = useState({
        calendar: calendar || '',
        category: category || '',
        location: location || '',
        organizer: organizer || '',
        guest: guest || '',
        min_date: min_date || '',
        max_date: max_date || '',
    });

    const onChange = (filterName, items, type = 'array') => {

        if (type === 'single') {

            setArgs(state => {
                return {
                    ...state, [filterName]: items
                }
            });

            return;
        }

        const ids = items.filter(item => {
            return item.active === true
        }).map(item => item.value);

        setArgs(state => {
            return {
                ...state, [filterName]: ids.join(',')
            }
        });
    }

    return (
        <StecDiv className='stec-manage-list-filterss'>

            <StecDiv className='stec-manage-list-filterss-buttons'>

                <FilterByTaxonomy
                    selectedItems={args.calendar}
                    activeItems={calendar}
                    label={__('Calendars', 'stachethemes_event_calendar_lite')}
                    icon={'fa-solid fa-calendar'}
                    taxonomy={'stec_cal'}
                    onChange={items => {
                        onChange('calendar', items);
                    }}
                />

                <FilterByTaxonomy
                    activeItems={category}
                    selectedItems={args.category}
                    label={__('Categories', 'stachethemes_event_calendar_lite')}
                    icon={'fa-solid fa-folder'}
                    taxonomy={'stec_cat'}
                    onChange={items => {
                        onChange('category', items);
                    }}
                />

                <FilterByTaxonomy
                    activeItems={location}
                    selectedItems={args.location}
                    label={__('Locations', 'stachethemes_event_calendar_lite')}
                    icon={'fa-solid fa-map'}
                    taxonomy={'stec_loc'}
                    onChange={items => {
                        onChange('location', items);
                    }}
                />

                <FilterByTaxonomy
                    activeItems={organizer}
                    selectedItems={args.organizer}
                    label={__('Organizers', 'stachethemes_event_calendar_lite')}
                    icon={'fa-solid fa-user'}
                    taxonomy={'stec_org'}
                    onChange={items => {
                        onChange('organizer', items);
                    }}
                />

                <FilterByTaxonomy
                    activeItems={guest}
                    selectedItems={args.guest}
                    label={__('Guests', 'stachethemes_event_calendar_lite')}
                    icon={'fa-solid fa-star'}
                    taxonomy={'stec_gst'}
                    onChange={items => {
                        onChange('guest', items);
                    }}
                />

                <FilterByDates
                    label={__('Date', 'stachethemes_event_calendar_lite')}
                    icon={'fa-solid fa-clock'}
                    activeValues={{
                        minDate: min_date,
                        maxDate: max_date
                    }}
                    values={{
                        minDate: args.min_date,
                        maxDate: args.max_date
                    }}
                    onChange={values => {
                        onChange(values['key'], values.value, 'single');
                    }}
                />

                <StecSpan className='stec-manage-list-filterss-control-buttons'>

                    <StecSpan className='stec-manage-list-filterss-apply' onClick={() => {
                        props.onApply(args);
                    }}>
                        <i className='fa-solid fa-filter' />{__('Apply', 'stachethemes_event_calendar_lite')}
                    </StecSpan>

                    <StecSpan className='stec-manage-list-filterss-clear' onClick={() => {
                        const emptyValues = {
                            calendar: '',
                            category: '',
                            location: '',
                            organizer: '',
                            guest: '',
                            min_date: '',
                            max_date: ''
                        };

                        setArgs(emptyValues);

                        props.onApply(emptyValues);
                    }}>
                        <i className='fa-solid fa-times' />{__('Clear', 'stachethemes_event_calendar_lite')}
                    </StecSpan>

                </StecSpan>

            </StecDiv>

            <UncontrolledDelayedInputText
                placeholder={__('Search', 'stachethemes_event_calendar_lite')}
                defaultValue={search || ''}
                onChange={value => {

                    props.onApply({ ...args, search: value });

                }}
            />
        </StecDiv>
    )
}

export default ListFilters

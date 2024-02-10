import { newApiDelete } from '@Stec/JS/api';
import { __, _n, _x, sprintf } from '@wordpress/i18n';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import TermList from '../taxonomy-manager/List';

function List() {

    const [instanceKey, setInstanceKey] = useState(0);

    const emptyCalendar = (item, blockActionRef) => {

        if (blockActionRef.current === true) {
            toast(__('Another action is in progress', 'stachethemes_event_calendar_lite'));
            return;
        }

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function deleteEvents() {

                    try {

                        const result = await newApiDelete({
                            route: 'DELETE-FROM-CALENDAR',
                            args: item.id,
                            errorMessage: 'auto'
                        });

                        setInstanceKey(new Date().getTime());

                        return resolve(__('Events deleted', 'stachethemes_event_calendar_lite'));

                    } catch (e) {
                        
                        return reject(e.message);
                    }


                }

                deleteEvents();

            }),
            {
                loading: __('Deleting', 'stachethemes_event_calendar_lite'),

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

    const props = {
        listPageId: 'calendars-list',
        upsertPageId: 'calendars-upsert',
        restUrl: 'CALENDARS',
        termLabelSingle: __('calendar', 'stachethemes_event_calendar_lite'),
        termLabelPlural: __('calendars', 'stachethemes_event_calendar_lite'),
        taxonomyName: 'stec_cal',
        itemsMap: (item, itemControls, checkedItems, blockActionRef) => {

            let calendarItemControls = [...itemControls];

            if (item.count > 0) {

                const emptyButton = {
                    id: 'empty-calendar',
                    label: [<i key='icon' className='fa-solid fa-broom' />, _x('Empty', 'Empty the calendar', 'stachethemes_event_calendar_lite')],
                    color: 'yellow',
                    onClick: () => {
                        emptyCalendar(item, blockActionRef);
                    }
                };

                // prepend emptyButton to calendarItemControls
                calendarItemControls = [emptyButton, ...calendarItemControls];

            }

            return {
                key: item.id,
                id: item.id,
                title: `${item.name} (ID#${item.id})`,
                description: sprintf(_n('Used by %d event', 'Used by %d events', item.count, 'stachethemes_event_calendar_lite'), item.count),
                thumbnail: {
                    type: item.meta.thumbnail.type,
                    icon: item.meta.thumbnail.icon,
                    image: item.meta.thumbnail?.image[0]?.sizes?.thumbnail,
                    backgroundColor: item.meta.color,
                    color: '#fff',
                    day: 'DD',
                    month: 'MMM'
                },
                controls: calendarItemControls,
                checked: checkedItems.some(id => item.id === id)
            }
        }
    }

    return <TermList key={instanceKey} {...props} />

}

export default List
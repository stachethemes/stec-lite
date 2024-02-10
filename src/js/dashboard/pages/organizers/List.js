import { __, _n, sprintf } from '@wordpress/i18n';
import TermList from '../taxonomy-manager/List';

function List() {

    const props = {
        listPageId: 'organizers-list',
        upsertPageId: 'organizers-upsert',
        restUrl: 'ORGANIZERS',
        termLabelSingle: __('organizer', 'stachethemes_event_calendar_lite'),
        termLabelPlural: __('organizers', 'stachethemes_event_calendar_lite'),
        taxonomyName: 'stec_org',
        itemsMap: (item, itemControls, checkedItems) => {
            
            const hasImage = item.meta.photo[0]?.sizes.thumbnail;

            return (
                {
                    key: item.id,
                    id: item.id,
                    title: `${item.name} (ID#${item.id})`,
                    description: sprintf(_n('Used by %d event', 'Used by %d events', item.count, 'stachethemes_event_calendar_lite'), item.count),
                    thumbnail: {
                        type: hasImage ? 'image' : 'icon',
                        icon: 'fa-solid fa-user',
                        image: hasImage ? hasImage : '',
                        backgroundColor: item.meta.color,
                        color: '#fff',
                    },
                    controls: itemControls,
                    checked: checkedItems.some(id => item.id === id)
                }
            )
        }
    }

    return <TermList {...props} />

}

export default List
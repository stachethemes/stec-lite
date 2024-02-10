import { __, _n, sprintf } from '@wordpress/i18n';
import TermList from '../taxonomy-manager/List';

function List() {

    const props = {
        listPageId: 'categories-list',
        upsertPageId: 'categories-upsert',
        restUrl: 'CATEGORIES',
        termLabelSingle: __('category', 'stachethemes_event_calendar_lite'),
        termLabelPlural: __('categories', 'stachethemes_event_calendar_lite'),
        taxonomyName: 'stec_cat',
        itemsMap: (item, itemControls, checkedItems) => {
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
                controls: itemControls,
                checked: checkedItems.some(id => item.id === id)
            }
        }
    }

    return <TermList {...props} />

}

export default List
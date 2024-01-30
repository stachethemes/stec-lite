import { __, _n, sprintf } from '@wordpress/i18n';
import TermList from '../taxonomy-manager/List';

function List() {

    const props = {
        listPageId: 'guests-list',
        upsertPageId: 'guests-upsert',
        restUrl: 'GUESTS',
        termLabelSingle: __('guest', 'stec'),
        termLabelPlural: __('guests', 'stec'),
        taxonomyName: 'stec_gst',
        itemsMap: (item, itemControls, checkedItems) => {

            const hasImage = item.meta.photo[0]?.sizes.thumbnail;

            return (
                {
                    key: item.id,
                    id: item.id,
                    title: `${item.name} (ID#${item.id})`,
                    description: sprintf(_n('Used by %d event', 'Used by %d events', item.count, 'stec'), item.count),
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
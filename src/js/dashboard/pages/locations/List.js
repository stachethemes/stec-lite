import { __, _n, sprintf } from '@wordpress/i18n';
import TermList from '../taxonomy-manager/List';

function List() {

    const props = {
        listPageId: 'locations-list',
        upsertPageId: 'locations-upsert',
        restUrl: 'LOCATIONS',
        termLabelSingle: __('location', 'stec'),
        termLabelPlural: __('locations', 'stec'),
        taxonomyName: 'stec_loc',
        itemsMap: (item, itemControls, checkedItems) => {

            return {
                key: item.id,
                id: item.id,
                title: `${item.name} (ID#${item.id})`,
                description: sprintf(_n('Used by %d event', 'Used by %d events', item.count, 'stec'), item.count),
                thumbnail: {
                    type: 'icon',
                    icon: item.meta.type === 'physical' ? 'fa-solid fa-globe-americas' : 'fa-solid fa-wifi',
                    image: '',
                    backgroundColor: item.meta.color,
                    color: '#fff',
                },
                controls: itemControls,
                checked: checkedItems.some(id => item.id === id)
            }

        }
    }

    return <TermList {...props} />

}

export default List
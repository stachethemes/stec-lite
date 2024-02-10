const { registerBlockType } = wp.blocks;
import '@Stec/LESS/widgets/events-list/edit/style.less';
import { __ } from '@wordpress/i18n';
import attributes from './attributes';
import Edit from './edit';

registerBlockType('stec/widget-events-list', {
    apiVersion: 2,
    title: __('Events List', 'stachethemes_event_calendar_lite'),
    icon: 'editor-justify',
    category: 'stachethemes',
    attributes: attributes,
    edit: Edit,
    save: (props) => {
        return null;
    }
});
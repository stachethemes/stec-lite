const { registerBlockType } = wp.blocks;
import '@Stec/LESS/widgets/events-list/edit/style.less';
import { __ } from '@wordpress/i18n';
import attributes from './attributes';
import edit from './edit';

registerBlockType('stec/widget-events-slider', {
    apiVersion: 2,
    title: __('Events Slider', 'stec'),
    icon: 'slides',
    category: 'stachethemes',
    attributes: attributes,
    edit,
    save: (props) => {
        return null;
    }
});
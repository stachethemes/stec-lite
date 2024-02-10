import '@Stec/LESS/widgets/stec/edit/style.less';
import { __ } from '@wordpress/i18n';
import attributes from './attributes';
import Edit from './edit';

const { registerBlockType } = wp.blocks;

(function () {
    const StachethemesIcon = <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="80.000000pt" height="80.000000pt" viewBox="0 0 80.000000 80.000000"
        preserveAspectRatio="xMidYMid meet">

        <g transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path d="M0 400 l0 -400 400 0 400 0 0 400 0 400 -400 0 -400 0 0 -400z m518
   138 c7 -7 12 -31 12 -55 0 -34 -3 -41 -15 -37 -9 4 -15 19 -15 40 l0 34 -105
   0 -105 0 0 -35 c0 -24 -5 -35 -15 -35 -18 0 -21 51 -5 81 10 17 22 19 123 19
   75 0 117 -4 125 -12z m-102 -90 c22 12 55 1 101 -34 34 -26 58 -30 68 -13 4 6
   0 9 -11 7 -13 -2 -19 3 -19 17 0 31 39 27 43 -5 7 -65 -70 -87 -155 -44 l-49
   24 -48 -25 c-60 -30 -95 -32 -130 -4 -29 23 -34 50 -10 69 12 11 18 11 31 -2
   8 -9 12 -21 9 -27 -10 -16 -26 -13 -20 3 3 8 1 17 -5 21 -7 4 -8 0 -4 -11 5
   -13 3 -15 -7 -9 -8 5 -11 3 -8 -6 8 -24 38 -22 73 5 46 36 76 45 101 34 14 -7
   28 -7 40 0z m-132 -124 c9 -12 32 -15 108 -15 98 -1 123 4 113 22 -4 5 1 9 9
   9 19 0 22 -45 4 -56 -7 -4 -30 -7 -51 -5 -21 1 -45 -3 -53 -10 -11 -9 -20 -9
   -39 1 -13 7 -35 10 -49 6 -36 -9 -66 9 -66 39 0 29 8 32 24 9z"/>
            <path d="M561 423 c0 -11 3 -13 6 -5 2 6 10 9 15 6 7 -4 8 -2 4 4 -11 18 -26
   14 -25 -5z"/>
        </g>
    </svg>;

    wp.blocks.updateCategory('stachethemes', { icon: StachethemesIcon });
})();

registerBlockType('stec/widget-stec', {
    apiVersion: 2,
    title: __('Full Calendar', 'stachethemes_event_calendar_lite'),
    icon: 'calendar-alt',
    category: 'stachethemes',
    attributes: attributes,
    edit: Edit,
    save: (props) => {
        return null;
    }
});



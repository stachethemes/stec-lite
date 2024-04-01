/**
 * Initial state of the category form
 * Can be overidden by global STEC_CATEGORY_TEMPLATE variable if exists 
 */
const template = typeof window.STEC_CATEGORY_TEMPLATE !== 'undefined' ? window.STEC_CATEGORY_TEMPLATE : {
    name: '',
    slug: '',
    status: 'publish',
    meta: {
        author: '', // Author is auto populated from the class.rest-stec_cat-controller.php
        color: '#A7C7E7',
        thumbnail: {
            type: 'icon',
            icon: '',
            image: []
        },
        read_permission: ['stec_public'],
        use_permission: ['stec_private'],
        edit_permission: ['stec_private'],
    }
};

export default template
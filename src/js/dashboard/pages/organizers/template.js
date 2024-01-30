/**
 * Initial state of the organizer form
 * Can be overidden by global STEC_ORGANIZER_TEMPLATE variable if exists 
 */
const template = typeof window.STEC_ORGANIZER_TEMPLATE !== 'undefined' ? window.STEC_ORGANIZER_TEMPLATE : {
    name: '',
    slug: '',
    status: 'publish',
    description: '',
    meta: {
        author: '', // Author is auto populated from the class.rest-stec_org-controller.php
        color: '#B4CFB0',
        photo: [],
        email: '',
        social: [],
        read_permission: ['stec_public'],
        use_permission: ['stec_private'],
        edit_permission: ['stec_private'],
    }
};

export default template
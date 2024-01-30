/**
 * Initial state of the guest form
 * Can be overidden by global STEC_GUEST_TEMPLATE variable if exists 
 */
const template = typeof window.STEC_GUEST_TEMPLATE !== 'undefined' ? window.STEC_GUEST_TEMPLATE : {
    name: '',
    slug: '',
    status: 'publish',
    description: '',
    meta: {
        author: '', // Author is auto populated from the class.rest-stec_gst-controller.php
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
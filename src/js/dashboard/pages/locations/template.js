/**
 * Initial state of the location form
 * Can be overidden by global STEC_LOCATION_TEMPLATE variable if exists 
 */
const template = typeof window.STEC_LOCATION_TEMPLATE !== 'undefined' ? window.STEC_LOCATION_TEMPLATE : {
    name: '',
    slug: '',
    status: 'publish',
    description: '',
    meta: {
        author: '', // Author is auto populated from the class.rest-stec_locc-controller.php
        color: '#FFE59D',
        type: 'physical',
        coordinates: '',
        country: '',
        state: '',
        city: '',
        address: '',
        postal_code: '',
        read_permission: ['stec_public'],
        use_permission: ['stec_private'],
        edit_permission: ['stec_private'],
        protected: false
    }
};

export default template
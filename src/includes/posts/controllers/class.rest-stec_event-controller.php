<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Rest_Stec_Event_Controller extends \WP_REST_Posts_Controller {

    use Rest_Post_Traits;

    protected $rest_base = 'events';

    public function read_permission(\WP_REST_Request $request) {

        /**
         * If permission_type is inlcuded in the read request check if the user has the global capability
         * E.g. Show me the calendars I can 'edit' or I can 'use'
         */
        $permission_type = $request->get_param('permission_type');

        switch ($permission_type) {

            case 'edit_permission':

                return current_user_can("manage_{$this->post_type}");

                break;

            default:

                return current_user_can("read_{$this->post_type}");
        }
    }

    public function create_permission(\WP_REST_Request $request) {

        $can_manage = current_user_can("manage_{$this->post_type}");
        $is_logged_in = is_user_logged_in();

        return $can_manage && $is_logged_in;
    }

    public function edit_permission(\WP_REST_Request $request) {

        $id = $request->get_param('id');

        return Permissions::current_user_has_post_permission($id, $this->post_type, 'edit_permission');
    }

    public function delete_permission(\WP_REST_Request $request) {

        $id = $request->get_param('id');

        return Permissions::current_user_has_post_permission($id, $this->post_type, 'edit_permission');
    }

    private function get_create_item_approve_state($request, $data, $initiator) {

        if (0 !== (int) $initiator && is_super_admin($initiator)) {
            return 1;
        }

        $calendar_id = (int) ((array) $data['stec_cal'])[0];

        $require_approval =  (bool) get_term_meta($calendar_id, 'require_event_approval', true);

        if (false === $require_approval) {
            return 1;
        }


        return (int) Permissions::user_has_term_permission($initiator, $calendar_id, 'stec_cal', 'edit_permission');
    }

    public function create_item($request) {

        try {

            $initiator = get_current_user_id();

            $data = $request->get_json_params();

            if (false === is_array($data['stec_cal']) || !$data['stec_cal']) {
                throw new Stec_Exception(esc_html__('Event must have a calendar', 'stachethemes_event_calendar_lite'));
            }

            $calendar = get_term($data['stec_cal'][0], 'stec_cal');

            if (false === $calendar instanceof \WP_Term) {
                throw new Stec_Exception(esc_html__('Event must have a calendar', 'stachethemes_event_calendar_lite'));
            }

            if (false === Permissions::user_has_term_permission($initiator, $calendar, 'stec_cal', 'use_permission')) {
                throw new Stec_Exception(esc_html__("You do not have permission to use this calendar", 'stachethemes_event_calendar_lite'));
            }

            // Set start_date_utc and end_date_utc
            $timezone = $data['meta']['timezone'];

            if ('stec_cal_default' === $timezone) {
                $timezone = get_term_meta($data['stec_cal'][0], 'timezone', true);
            }

            $data['meta']['start_date_utc'] = Helpers::get_datetime_utc($data['meta']['start_date'], $timezone);
            $data['meta']['end_date_utc']   = Helpers::get_datetime_utc($data['meta']['end_date'], $timezone);

            // Default permissions if empty
            if (false === isset($data['meta']['read_permission']) || !$data['meta']['read_permission']) {
                $data['meta']['read_permission'] = 'stec_public';
            }

            if (false === isset($data['meta']['edit_permission']) || !$data['meta']['edit_permission']) {
                $data['meta']['edit_permission'] = 'stec_private';
            }

            // Auto populate the author id
            $data['author']         = $initiator;
            $data['meta']['author'] = $initiator;

            // Check UID
            if (false === isset($data['meta']['uid']) || !$data['meta']['uid']) {
                $data['meta']['uid'] = uniqid('stec-');
            }

            // Approve
            $data['meta']['approved'] = $this->get_create_item_approve_state($request, $data, $initiator);

            // Assign super (e.g. the calendar author)
            // author - the event creator
            // super  - a person who has authority to edit this event
            // for example the author of the calendar where this event resides
            $super = get_term_meta($data['stec_cal'][0], 'author', true);
            $data['meta']['super'] = $super;

            $data = self::register_featured_image($data);

            // Optional filter to modify the data before creating the event
            $data = apply_filters('stec_before_create_event', $data, $request);

            $encodedData = wp_json_encode($data);
            $request->set_body($encodedData);

            // If requested context is "event" make sure event object is returned
            // this is usually requested by the front-end submit form
            if ($request->get_param('context') === 'event') {

                add_action("rest_after_insert_stec_event", function ($post, $request) {
                    $request->set_param('context', 'event');
                }, 10, 2);
            }

            $result = parent::create_item($request);

            if (false === is_wp_error($result)) {

                $result_data = $result->get_data();

                do_action('stec_after_create_event', $result_data['id'], $data, $request);
            }

            return $result;
        } catch (Stec_Exception $ex) {

            $error = new \WP_Error('stec_create_item_error', $ex->getMessage());
            $response = rest_ensure_response($error);

            return $response;
        }
    }

    public function filter_before_query($prepared_args, \WP_REST_Request $request) {

        /**
         * TAXONOMY FILTERS
         */
        if (isset($prepared_args['tax_query'])) {
            if (false === is_array($prepared_args['tax_query'])) {
                $prepared_args['tax_query'] = array();
            }
        }

        $taxonomies_to_look_for = array(
            array(
                'param'    => 'calendar',
                'taxonomy' => 'stec_cal'
            ),
            array(
                'param'    => 'category',
                'taxonomy' => 'stec_cat'
            ),
            array(
                'param'    => 'organizer',
                'taxonomy' => 'stec_org'
            ),
            array(
                'param'    => 'location',
                'taxonomy' => 'stec_loc'
            ),
            array(
                'param'    => 'guest',
                'taxonomy' => 'stec_gst'
            ),
        );

        foreach ($taxonomies_to_look_for as $tax_props) {

            if ($request->get_param($tax_props['param'])) {

                $tax_ids           = $request->get_param($tax_props['param']);
                $tax_ids_array     = explode(',', $tax_ids);
                $search_unassigned = false;

                if (true === in_array(-1, $tax_ids_array)) {
                    $all_terms         = get_terms(array('taxonomy' => $tax_props['taxonomy'], 'fields' => 'ids'));
                    $search_unassigned = true;
                    $tax_ids_array     = array_filter($tax_ids_array, function ($test) {
                        return (int) $test !== -1;
                    });
                }

                if ($tax_ids_array || $search_unassigned) {

                    $tax_query = array(
                        'relation' => 'OR',
                        array(
                            'taxonomy' => $tax_props['taxonomy'],
                            'field'    => 'term_id',
                            'terms'    => $tax_ids_array
                        )
                    );

                    if ($search_unassigned) {

                        $tax_query[] = array(
                            'taxonomy' => $tax_props['taxonomy'],
                            'field'    => 'term_id',
                            'terms'     => $all_terms,
                            'operator' => 'NOT IN',
                        );

                        if (!$all_terms) {
                            $tax_query = '';
                        }
                    }

                    $prepared_args['tax_query'][] = $tax_query;
                }
            }
        }

        // Check featured flag
        if ($request->get_param('featured') && 1 === (int) $request->get_param('featured')) {
            $prepared_args['meta_query'][] = array(
                'key'          => 'featured',
                'value'        => '',
                'compare'      => '!='
            );

            if (isset($prepared_args['featured'])) {
                unset($prepared_args['featured']);
            }
        }

        /**
         * MIN/MAX DATE FILTERS
         */
        $min_max_meta_query = false;
        $min_date           = $request->get_param('min_date');
        $max_date           = $request->get_param('max_date');
        $minmax_intersect   = (bool) $request->get_param('minmax_intersect');

        if ($min_date || $max_date) {

            if (isset($prepared_args['min_date'])) {
                unset($prepared_args['min_date']);
            }

            if (isset($prepared_args['max_date'])) {
                unset($prepared_args['max_date']);
            }

            /**
             * Note 'start_date' / 'end_date' key is used for back-end range filters
             * 'start_date_utc' / 'end_date_utc' is used for front-end range filters
             */

            $min_max_filter_start_date_key = $request->get_param('context') === 'edit' ?
                "start_date" :
                "start_date_utc";

            $min_max_filter_end_date_key = $request->get_param('context') === 'edit' ?
                "end_date" :
                "end_date_utc";

            $min_max_meta_query = false;

            if ($min_date || $max_date) {

                $meta_query_base = array(
                    'relation' => 'AND',
                    array(
                        'relation' => 'OR',
                        array(
                            'key'     => $min_max_filter_start_date_key,
                            'compare' => isset($min_date) ? ($minmax_intersect ? '<=' : '>=') : '<=',
                            'value'   => isset($min_date) ? $min_date : $max_date,
                            'type'    => 'DATETIME',
                        ),
                        array(
                            'key'     => $min_max_filter_end_date_key,
                            'compare' => isset($min_date) ? ($minmax_intersect ? '>=' : '>=') : '<=',
                            'value'   => isset($min_date) ? $min_date : $max_date,
                            'type'    => 'DATETIME',
                        )
                    )
                );

                if ($min_date && $max_date) {

                    if ($minmax_intersect) {
                        // Get events intersecting with the given range
                        $meta_query_base['relation'] = 'AND';
                        $meta_query_base[0] = array(
                            'relation' => 'OR',
                            array(
                                'key'     => $min_max_filter_start_date_key,
                                'value'   => [$min_date, $max_date],
                                'compare' => 'BETWEEN',
                                'type'    => 'DATETIME',
                            ),
                            array(
                                'key'     => $min_max_filter_end_date_key,
                                'value'   => [$min_date, $max_date],
                                'compare' => 'BETWEEN',
                                'type'    => 'DATETIME',
                            ),
                            array(
                                'key'     => $min_max_filter_start_date_key,
                                'value'   => $min_date,
                                'compare' => '<=',
                                'type'    => 'DATETIME',
                            ),
                            array(
                                'key'     => $min_max_filter_end_date_key,
                                'value'   => $max_date,
                                'compare' => '>=',
                                'type'    => 'DATETIME',
                            ),
                        );
                    } else {
                        $min_max_meta_query = array(
                            'key'     => $min_max_filter_start_date_key,
                            'value'   => [$min_date, $max_date],
                            'compare' => 'BETWEEN',
                            'type'    => 'DATETIME',
                        );
                    }
                } else {
                    $min_max_meta_query = $meta_query_base;
                }
            }
        }

        if ($min_max_meta_query) {

            $prepared_args['meta_query'][] = array(
                'relation' => 'OR',
                array(
                    'key'          => 'rrule',
                    'value'        => '',
                    'compare'      => '!='
                ),
                $min_max_meta_query
            );
        }

        // FILTER BY READ PERMISSION
        // and return events only with the given read permission
        if ($request->get_param('read_permission')) {
            $prepared_args['meta_query'][] = array(
                'key'          => 'read_permission',
                'value'        => $request->get_param('read_permission'),
                'compare'      => '='
            );
        }

        if ($request->get_param('context') === 'edit') {
            // Order by approved and start date
            $prepared_args['meta_query'][] = array(
                'relation' => 'AND',
                'start_date_utc_clause' => array(
                    'key'     => 'start_date_utc',
                    'compare' => 'EXISTS',
                ),
                'approved_clause' => array(
                    'key'     => 'approved',
                    'compare' => 'EXISTS',
                )
            );

            $prepared_args['orderby']  = array(
                'approved_clause'       => 'ASC',
                'start_date_utc_clause' => 'DESC'
            );
        } else {
            // order by id
            $prepared_args['orderby']  = array(
                'ID' => 'DESC'
            );
        }

        // Check event_status flag (widget uses this flag)
        if ($request->get_param('event_status') && '' !== $request->get_param('event_status')) {

            $event_status_array = explode(',', $request->get_param('event_status'));

            $prepared_args['meta_query'][] = array(
                'key'          => 'event_status',
                'value'        => $event_status_array,
                'compare'      => 'IN'
            );
        }

        // This makes sure the events have calendar attached
        // requires event context
        if ('event' === $request->get_param('context')) {
            $all_calendar_terms = get_terms(array('taxonomy' => 'stec_cal', 'fields' => 'ids'));
            $prepared_args['tax_query'][] = array(
                'taxonomy' => 'stec_cal',
                'terms'    => $all_calendar_terms,
                'operator' => 'IN'
            );
        }

        return $prepared_args;
    }

    /**
     * Check get_maybe_custom_collection_params in trait.rest-post-traits.php for more info
     * Basically this will override the default collection params
     * in order to allow more items per page
     */
    public function get_items_collection_params() {

        $collection = $this->get_collection_params();

        $collection['per_page']['maximum'] = 500;

        return $collection;
    }

    public function add_rest_route() {

        register_rest_route(
            $this->namespace,
            $this->rest_base . '/archive/(?P<id>[\d]+)',
            array(
                array(
                    'methods'             => \WP_REST_Server::EDITABLE,
                    'callback'            => array($this, 'archive_event'),
                    'permission_callback' => array($this, 'edit_permission'),
                    'args'                => $this->get_collection_params(),
                ),
                'schema' => array($this, 'get_public_item_schema'),
            )
        );

        register_rest_route(
            $this->namespace,
            $this->rest_base . '/unarchive/(?P<id>[\d]+)',
            array(
                array(
                    'methods'             => \WP_REST_Server::EDITABLE,
                    'callback'            => array($this, 'unarchive_event'),
                    'permission_callback' => array($this, 'edit_permission'),
                    'args'                => $this->get_collection_params(),
                ),
                'schema' => array($this, 'get_public_item_schema'),
            )
        );

        register_rest_route(
            $this->namespace,
            $this->rest_base . '/empty-archive',
            array(
                array(
                    'methods'             => \WP_REST_Server::DELETABLE,
                    'callback'            => array($this, 'empty_arhive'),
                    'permission_callback' => function () {
                        return is_user_logged_in(); // will check further if the user has permission to empty the archive in the empty_archive function
                    },
                    'args'                => $this->get_collection_params(),
                ),
                'schema' => array($this, 'get_public_item_schema'),
            )
        );

        register_rest_route(
            $this->namespace,
            'delete-from-calendar/(?P<id>[\d]+)',
            array(
                array(
                    'methods'             => \WP_REST_Server::DELETABLE,
                    'callback'            => array($this, 'delete_from_calendar'),
                    'permission_callback' => function () {
                        // it will further check if the user has permission to delete the events from this 
                        // calendar in the delete_from_calendar function
                        return is_user_logged_in();
                    },
                    'args'                => $this->get_collection_params(),
                ),
                'schema' => array($this, 'get_public_item_schema'),
            )
        );
    }

    /**
     * Prepares event data for ?context=event
     */
    public function filter_response_by_context($data, $context) {

        switch ($context) {

            case 'event':

                $data['title']             = $data['title']['raw'];
                $data['description']       = apply_filters('the_content', $data['content']['raw']);
                $data['short_description'] = $data['excerpt']['raw'];

                if ('stec_cal_default' === $data['meta']['timezone']) {
                    $data['meta']['timezone'] = get_term_meta($data['stec_cal'][0], 'timezone', true);
                }

                /**
                 * COMMENTS
                 */
                $data['comments'] = comments_open($data['id']);

                /**
                 * CALENDAR DATA
                 */
                $calendar_term = get_term($data['stec_cal'][0], 'stec_cal');

                $data['calendar'] = array(
                    'id'        => $data['stec_cal'][0],
                    'title'     => $calendar_term->name,
                    'color'     => get_term_meta($data['stec_cal'][0], 'color', true),
                    'thumbnail' => get_term_meta($data['stec_cal'][0], 'thumbnail', true)
                );

                /**
                 * CATEGORIES DATA
                 */
                $data['categories'] = array();

                foreach ($data['stec_cat'] as $cat_term_id) {

                    $category_term = get_term($cat_term_id, 'stec_cat');

                    $data['categories'][] = array(
                        'id'    => $cat_term_id,
                        'title' => $category_term->name,
                        'color' => get_term_meta($cat_term_id, 'color', true),
                        'thumbnail' => get_term_meta($cat_term_id, 'thumbnail', true)
                    );
                }

                /**
                 * LOCATION DATA
                 */
                foreach ($data['stec_loc'] as $loc_term_id) {

                    $location_term = get_term($loc_term_id, 'stec_loc');

                    $data['location'] = array(
                        'id'            => $loc_term_id,
                        'title'         => $location_term->name,
                        'color'         => get_term_meta($loc_term_id, 'color', true),
                        'type'          => get_term_meta($loc_term_id, 'type', true),
                        'country'       => get_term_meta($loc_term_id, 'country', true),
                        'state'         => get_term_meta($loc_term_id, 'state', true),
                        'city'          => get_term_meta($loc_term_id, 'city', true),
                        'postal_code'   => get_term_meta($loc_term_id, 'postal_code', true),
                        'address'       => get_term_meta($loc_term_id, 'address', true),
                        'coordinates'   => get_term_meta($loc_term_id, 'coordinates', true),
                        'protected'     => (bool) get_term_meta($loc_term_id, 'protected', true),
                        'description'   => apply_filters('the_content', $location_term->description)
                    );

                    if ($data['location']['protected'] === true) {

                        if (false === is_user_logged_in()) {
                            $data['location']['address'] = '';
                            $data['location']['description'] = '';
                        } else {
                            $data['location']['protected'] = false;
                        }
                    }
                }

                /**
                 * ORGANIZERS DATA
                 */

                $data['organizers'] = array();

                foreach ($data['stec_org'] as $org_term_id) {

                    $organizer_term  = get_term($org_term_id, 'stec_org');
                    $hide_email      = (bool) Settings::get('calendar', 'hide_emails', false);
                    $organizer_email = ($hide_email && !is_user_logged_in()) ? '' : get_term_meta($org_term_id, 'email', true);

                    $data['organizers'][] = array(
                        'id' => $org_term_id,
                        'title' => $organizer_term->name,
                        'photo' => get_term_meta($org_term_id, 'photo', true),
                        'color' => get_term_meta($org_term_id, 'color', true),
                        'social' => get_term_meta($org_term_id, 'social', false),
                        'email' => $organizer_email,
                        'description' => apply_filters('the_content', $organizer_term->description),
                        'verified' => (bool) get_term_meta($org_term_id, 'verified', true)
                    );
                }

                /**
                 * GUESTS DATA
                 */

                $data['guests'] = array();

                foreach ($data['stec_gst'] as $gst_term_id) {

                    $guest_term      = get_term($gst_term_id, 'stec_gst');
                    $hide_email      = (bool) Settings::get('calendar', 'hide_emails', false);
                    $guest_email     = ($hide_email && !is_user_logged_in()) ? '' : get_term_meta($gst_term_id, 'email', true);


                    $data['guests'][] = array(
                        'id'            => $gst_term_id,
                        'title'         => $guest_term->name,
                        'photo'         => get_term_meta($gst_term_id, 'photo', true),
                        'color'         => get_term_meta($gst_term_id, 'color', true),
                        'social'        => get_term_meta($gst_term_id, 'social', false),
                        'email'         => $guest_email,
                        'description'   => apply_filters('the_content', $guest_term->description)
                    );
                }

                /**
                 * Add the_content filter to the schedule details
                 */
                if (is_array($data['meta']['schedule'])) {
                    foreach ($data['meta']['schedule'] as $k => $schedule) {
                        $data['meta']['schedule'][$k]['details'] = apply_filters('the_content', $schedule['details']);
                    }
                }

                /**
                 * PERMALINK
                 */
                $data['permalink'] = get_the_permalink($data['id']);

                /**
                 * Flag if user can edit this event
                 */
                $data['editable'] = Permissions::current_user_has_post_permission($data['id'], 'stec_event', 'edit_permission');

                /**
                 * UNSET some irrelevant for the front-end keys
                 */
                foreach (array('content', 'excerpt', 'stec_cal', 'stec_loc', 'stec_gst', 'stec_org', 'stec_cat') as $unset_key) {
                    unset($data[$unset_key]);
                }

                foreach (array('anonymous', 'contact_name', 'contact_email', 'contact_phone', 'edit_permission', 'read_permission', 'import_session', 'manual_rrule', 'author_notes') as $unset_meta_key) {
                    unset($data['meta'][$unset_meta_key]);
                }

                return $data;

                break;

            default:

                if ('edit' !== $context) {
                    foreach (array('anonymous', 'contact_name', 'contact_email', 'contact_phone') as $unset_meta_key) {
                        unset($data['meta'][$unset_meta_key]);
                    }
                }

                return parent::filter_response_by_context($data, $context);
        }
    }

    public function update_item($request) {

        try {

            $initiator = get_current_user_id();

            $data = $request->get_json_params();

            if (false === is_array($data['stec_cal']) || !$data['stec_cal']) {
                throw new Stec_Exception(esc_html__('Event must have a calendar', 'stachethemes_event_calendar_lite'));
            }

            $calendar = get_term($data['stec_cal'][0], 'stec_cal');

            if (false === $calendar instanceof \WP_Term) {
                throw new Stec_Exception(esc_html__('Event must have a calendar', 'stachethemes_event_calendar_lite'));
            }

            if (false === Permissions::user_has_term_permission($initiator, $calendar, 'stec_cal', 'use_permission')) {
                throw new Stec_Exception(esc_html__("You do not have permission to use this calendar", 'stachethemes_event_calendar_lite'));
            }

            // Default permissions if empty
            if (false === isset($data['meta']['read_permission']) || !$data['meta']['read_permission']) {
                $data['meta']['read_permission'] = 'stec_public';
            }

            if (false === isset($data['meta']['edit_permission']) || !$data['meta']['edit_permission']) {
                $data['meta']['edit_permission'] = 'stec_private';
            }

            // Check if user is trying to change author
            $data_meta_author = isset($data['meta']['author']) ? $data['meta']['author'] : false;
            $original_author  = get_post_meta($data['id'], 'author', true);

            if ($data_meta_author && (int) $data_meta_author !== (int) $original_author) {

                if (false === user_can($initiator, 'edit_users')) {

                    $error = new \WP_Error('stec_update_error', esc_html__('You do not have permissions change event authors', 'stachethemes_event_calendar_lite'));
                    $response = rest_ensure_response($error);

                    return $response;
                }

                $data['author'] = (int) $data_meta_author;
            } else {

                $data['author']         = $original_author;
                $data['meta']['author'] = $original_author;
            }

            $old_approve_state = isset($data['meta']['approved']) ? $data['meta']['approved'] : 0;

            $data['meta']['approved'] = $this->get_create_item_approve_state($request, $data, $initiator);

            $new_approve_state = $data['meta']['approved'];

            // Assign super (e.g. calendar author)
            $super = get_term_meta($data['stec_cal'][0], 'author', true);
            $data['meta']['super'] = $super;

            // Set start_date_utc and end_date_utc
            $timezone = $data['meta']['timezone'];

            if ('stec_cal_default' === $timezone) {
                $timezone = get_term_meta($data['stec_cal'][0], 'timezone', true);
            }

            $data['meta']['start_date_utc'] = Helpers::get_datetime_utc($data['meta']['start_date'], $timezone);
            $data['meta']['end_date_utc']   = Helpers::get_datetime_utc($data['meta']['end_date'], $timezone);

            $data = self::register_featured_image($data);

            // Optional filter to modify the data before updating the event
            $data = apply_filters('stec_before_update_event', $data, $request);

            $encodedData = wp_json_encode($data);
            $request->set_body($encodedData);

            $drastic_changes = $this->get_drastic_update_changes($data['id'], $data);

            // If requested context is event make sure event object is returned
            // this is usually requested by the front-end submit form
            if ($request->get_param('context') === 'event') {
                add_action("rest_after_insert_stec_event", function ($post, $request) {
                    $request->set_param('context', 'event');
                }, 10, 2);
            }

            $result = parent::update_item($request);

            if (false === is_wp_error($result)) {

                if ($old_approve_state !== $new_approve_state) {
                    do_action('stec_after_event_approve_state', $data['id'], $new_approve_state, $request);
                }

                do_action('stec_after_update_event', $data['id'], $drastic_changes);
            }

            return $result;
        } catch (Stec_Exception $ex) {

            $error = new \WP_Error($ex->getMessage());
            $response = rest_ensure_response($error);

            return $response;
        }
    }

    /**
     * Retrieve important changes to the event that may affect the users
     */
    public function get_drastic_update_changes($post_id, $data) {

        $changes = array(
            'date'     => false,
            'location' => false,
            'status'   => false,
        );

        $start_date     = get_post_meta($post_id, 'start_date', true);
        $new_start_date = $data['meta']['start_date'];

        if ($start_date !== $new_start_date) {
            $changes['date'] = $start_date !== $new_start_date;
        }

        $location_term       = wp_json_encode(wp_get_post_terms($post_id, 'stec_loc', array('fields' => 'ids')));
        $new_location_term   = wp_json_encode($data['stec_loc']);

        $changes['location'] = $location_term !== $new_location_term;
        $event_status        = get_post_meta($post_id, 'event_status', true);
        $new_event_status    = $data['meta']['event_status'];
        $changes['status']   = $event_status !== $new_event_status;

        return $changes;
    }

    public function delete_item($request) {

        $id             = $request->get_param('id');
        $approve_state  = (bool) get_post_meta($id, 'approved', true);

        // If deleting an event that is not approved this hook will send rejection notice
        if (false === $approve_state) {
            do_action('stec_after_event_approve_state', $id, $approve_state, $request);
        }

        $result = parent::delete_item($request);

        if (false === is_wp_error($result)) {

            do_action('stec_after_delete_event', $id, $result);
        }

        return $result;
    }

    /**
     * Delete all events from calendar
     */
    public function delete_from_calendar($request) {

        try {

            $calendar_id = $request->get_param('id');

            if (false === Permissions::current_user_has_term_permission($calendar_id, 'stec_cal', 'edit_permission')) {
                throw new Stec_Exception(esc_html__('You do not have permission to delete events from this calendar', 'stachethemes_event_calendar_lite'));
            }

            $events_to_delete = get_posts(array(
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'post_type'      => 'stec_event',
                'post_status'    => array('publish', 'stec_archived'),
                'tax_query' => array(
                    array(
                        'taxonomy' => 'stec_cal',
                        'field'    => 'term_id',
                        'terms'    => $calendar_id
                    )
                )
            ));

            if (is_array($events_to_delete)) {
                foreach ($events_to_delete as $id) {
                    wp_delete_post($id, true);
                }
            }

            return true;
        } catch (Stec_Exception $ex) {

            $error = new \WP_Error('stec_delete_error', $ex->getMessage());
            $response = rest_ensure_response($error);

            return $response;
        }
    }

    /**
     * Archive event
     */
    public function archive_event($request) {

        try {

            $event_id = $request->get_param('id');

            $result = wp_update_post(array(
                'ID'          => $event_id,
                'post_status' => 'stec_archived'
            ));

            if (false === $result) {
                throw new Stec_Exception(esc_html__('Event could not be archived', 'stachethemes_event_calendar_lite'));
            }

            return true;
        } catch (Stec_Exception $ex) {

            $error = new \WP_Error('stec_archive_error', $ex->getMessage());
            $response = rest_ensure_response($error);

            return $response;
        }
    }

    /**
     * Un-Archive event
     */
    public function unarchive_event($request) {

        try {

            $event_id = $request->get_param('id');

            $result = wp_update_post(array(
                'ID'          => $event_id,
                'post_status' => 'publish'
            ));

            if (false === $result) {
                throw new Stec_Exception(esc_html__('Event could not be unarchived', 'stachethemes_event_calendar_lite'));
            }

            return true;
        } catch (Stec_Exception $ex) {

            $error = new \WP_Error('stec_archive_error', $ex->getMessage());
            $response = rest_ensure_response($error);

            return $response;
        }
    }

    /**
     * Delete archived events
     */
    public function empty_arhive($request) {

        try {

            // get all archived events
            $events_to_delete = get_posts(array(
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'post_type'      => 'stec_event',
                'post_status'    => 'stec_archived'
            ));

            if (is_array($events_to_delete)) {

                foreach ($events_to_delete as $id) {
                    if (true === Permissions::current_user_has_post_permission($id, 'stec_event', 'edit_permission')) {
                        wp_delete_post($id, true);
                    }
                }
            }

            return true;
        } catch (Stec_Exception $ex) {

            $error = new \WP_Error('stec_archive_error', $ex->getMessage());
            $response = rest_ensure_response($error);

            return $response;
        }
    }

    public function get_items($request) {

        $items = parent::get_items($request);

        if ($request->get_param('context') === 'edit') {

            $items_data = $items->get_data();

            // Add event timezone to each item
            // this is used for the backend list manager to 
            // convert the time to the user timezone 
            // if option is enabled
            $items_data = array_map(function ($item) {

                $event_timezone = $item['meta']['timezone'];

                if ('stec_cal_default' === $event_timezone) {
                    $event_timezone = Helpers::get_event_timezone($item['id']);
                }

                $item['timezone'] = $event_timezone;

                return $item;
            }, $items_data);

            $items->set_data($items_data);
        }

        /**
         * include_ro_data=1
         * When set it will also include the event recurrence overrides 
         * [
         *   'event_id' => 
         *   'recurrence_id' =>
         * ]
         * in 'recurrence_overrides' key ONLY if has any overrides
         * 
         */
        if (1 === (int) $request->get_param('include_ro_data')) {

            $items_data = $items->get_data();

            foreach ($items_data as $k => $event_data) {

                $has_repeater = (bool) $event_data['meta']['rrule'];
                $is_ro        = (bool) $event_data['meta']['recurrence_id'];
                $uid          = $event_data['meta']['uid'];

                if (!$has_repeater || $is_ro || !$uid) {
                    continue;
                }

                $recurrence_overrides = Events::get_recurrence_override_dates($uid);

                $items_data[$k]['recurrence_overrides'] = $recurrence_overrides;
            }

            $items->set_data($items_data);
        }

        $fields = $request->get_param('fields');

        // ? @todo check for better solution if possible
        if ($fields === 'ids') {
            $items_data = $items->get_data();
            $items_ids = array_map(function ($item) {
                return $item['id'];
            }, $items_data);

            $items->set_data($items_ids);
        }

        $items = apply_filters('stec_event_controller_get_items', $items, $request);

        return $items;
    }

    protected function before_get_item_request($request) {

        // This section checks if the event recurrence is overridden 
        // and retrieves the correct event id
        $context    = $request->get_param('context');
        $start_date = $request->get_param('start_date');

        if ('event' === $context && $start_date) {

            $recurrence = Events::get_event_recurrence_override($request->get_param('id'), $start_date);

            if ($recurrence) {
                $request->set_param('id', $recurrence);
            }
        }

        return $request;
    }

    public function get_item($request) {

        $request = $this->before_get_item_request($request);

        $item = parent::get_item($request);


        /**
         * include_ro_data=1
         * When set it will also include the event recurrence overrides 
         * [
         *   'event_id' => 
         *   'recurrence_id' =>
         * ]
         * in 'recurrence_overrides' key ONLY if has any overrides
         * 
         */
        if (1 === (int) $request->get_param('include_ro_data')) {

            $event_data = $item->get_data();

            $has_repeater = (bool) $event_data['meta']['rrule'];
            $is_ro        = (bool) $event_data['meta']['recurrence_id'];
            $uid          = $event_data['meta']['uid'];

            if ($has_repeater && !$is_ro && $uid) {
                $recurrence_overrides = Events::get_recurrence_override_dates($uid);
                $event_data['recurrence_overrides'] = $recurrence_overrides;
                $item->set_data($event_data);
            }
        }

        $item = apply_filters('stec_event_controller_get_item', $item, $request);
        return $item;
    }

    /**
     * Registers the first image from the event gallery as the featured image
     * ? Yoast SEO doesn't pick up the og:image data from the first try; only after resaving the event
     * ? However, the Yoast schema pick it up from the first try...
     */
    public function register_featured_image($data) {

        if (!isset($data['meta']['images']) || !is_array($data['meta']['images']) || !$data['meta']['images']) {
            return $data;
        }

        $image_id = $data['meta']['images'][0]['id'] ?? false;

        if (wp_get_attachment_image($image_id, 'thumbnail')) {
            $data['featured_media'] = (int) $image_id;
        }

        return $data;
    }
}

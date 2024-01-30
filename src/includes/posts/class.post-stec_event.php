<?php

namespace Stachethemes\Steclite;

class Post_Types_Stec_Event {

    use Post_Trait_Helpers;

    private static $post_type = 'stec_event';

    public static function init() {

        add_action('init', array(__CLASS__, 'register_post'), 5);
        add_action('init', array(__CLASS__, 'register_meta'), 5);
        add_action('init', array(__CLASS__, 'register_custom_post_status'), 5);
        add_action('init', array(__CLASS__, 'rewrite_rules'), 10);
        add_filter('rest_stec_event_item_schema', array(__CLASS__, 'register_event_context_schema'), 5);
        add_filter('template_include', array(__CLASS__, 'before_single_page_template'), 5);
        add_filter('the_content', array(__CLASS__, 'single_page_content'), 5);
        add_action('wp_enqueue_scripts',  array(__CLASS__, 'register_scripts'), 5);
        add_action('wp_enqueue_scripts',  array(__CLASS__, 'enqueue_single_scripts'), 5);
        add_filter('wp_enqueue_scripts', array(__CLASS__, 'register_single_instance'), 5);
    }

    public static function get_slug() {

        $slug = Settings::get('pages', 'events_page_slug');

        if (!$slug) {
            $slug = 'stec_event';
        }

        return $slug;
    }

    public static function register_post() {

        register_post_type(
            self::$post_type,
            array(
                'labels'                => self::get_post_labels(esc_html__('Event', 'stec'), esc_html__('Events', 'stec')),
                'rest_controller_class' => '\Stachethemes\Steclite\Rest_Stec_Event_Controller',
                'exclude_from_search'   => false,
                'public'                => true,
                'show_in_rest'          => true,
                'show_ui'               => false,
                'has_archive'           => false,
                'show_in_admin_bar'     => false,
                // Elementor requires show_in_nav_menus to be true in order to display Events cpt as a condition
                'show_in_nav_menus'     => true,
                'show_in_menu'          => false,
                'hierarchical'          => false,
                'can_export'            => false,
                'delete_with_user'      => false,
                'capability_type'       => array('stec_event', 'stec_event'),
                'capabilities'          => self::get_post_capabilities(self::$post_type),
                'map_meta_cap'          => false,
                'taxonomies'            => array('stec_cal', 'stec_cat', 'stec_loc', 'stec_org', 'stec_gst'),
                'supports'              => array('title', 'editor', 'excerpt', 'comments', 'custom-fields', 'author'),
                'rewrite'               => array('slug' => self::get_slug())
            )
        );
    }

    public static function register_meta() {

        register_post_meta(
            self::$post_type,
            'thumbnail',
            array(
                'type' => 'object',
                'single' => true,
                'show_in_rest' => array(
                    'schema' => array(
                        'type' => 'object',
                        'properties' => array(
                            'type' => array(
                                'type' => 'string'
                            ),
                            'icon' => array(
                                'type' => 'string'
                            ),
                            'image' => array(
                                'type' => 'array',
                                'properties' => array(
                                    'thumbnail' => array(
                                        'type' => 'string'
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );

        register_post_meta(
            self::$post_type,
            'images',
            array(
                'type' => 'object',
                'single' => false,
                'show_in_rest' => array(
                    'schema' => array(
                        'type' => 'object',
                        'properties' => array(
                            'id' => array(
                                'type' => 'number'
                            ),
                            'order' => array(
                                'type' => 'number'
                            ),
                            'sizes' => array(
                                'type' => 'object',
                                'properties' => array(
                                    'thumbnail' => array(
                                        'type' => 'string'
                                    ),
                                    'medium' => array(
                                        'type' => 'string'
                                    ),
                                    'large' => array(
                                        'type' => 'string'
                                    ),
                                    'full' => array(
                                        'type' => 'string'
                                    )
                                )
                            ),
                            'dimensions' => array(
                                'type' => 'object',
                                'properties' => array(
                                    'thumbnail' => array(
                                        'type' => 'object',
                                        'properties' => array(
                                            'width' => array(
                                                'type' => 'number'
                                            ),
                                            'height' => array(
                                                'type' => 'number'
                                            ),
                                            'ar' => array(
                                                'type' => 'number'
                                            )
                                        )
                                    ),
                                    'medium' => array(
                                        'type' => 'object',
                                        'properties' => array(
                                            'width' => array(
                                                'type' => 'number'
                                            ),
                                            'height' => array(
                                                'type' => 'number'
                                            ),
                                            'ar' => array(
                                                'type' => 'number'
                                            )
                                        )
                                    ),
                                    'large' => array(
                                        'type' => 'object',
                                        'properties' => array(
                                            'width' => array(
                                                'type' => 'number'
                                            ),
                                            'height' => array(
                                                'type' => 'number'
                                            ),
                                            'ar' => array(
                                                'type' => 'number'
                                            )
                                        )
                                    ),
                                    'full' => array(
                                        'type' => 'object',
                                        'properties' => array(
                                            'width' => array(
                                                'type' => 'number'
                                            ),
                                            'height' => array(
                                                'type' => 'number'
                                            ),
                                            'ar' => array(
                                                'type' => 'number'
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );

        register_post_meta(
            self::$post_type,
            'color',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'timezone',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'start_date',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'start_date_utc',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'end_date',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'end_date_utc',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'hide_end',
            array(
                'type'          => 'boolean',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => false
            )
        );

        register_post_meta(
            self::$post_type,
            'all_day',
            array(
                'type'          => 'boolean',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => false
            )
        );

        register_post_meta(
            self::$post_type,
            'recurrence_id',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'rrule',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'exdate',
            array(
                'type'          => 'string',
                'single'        => false,
                'show_in_rest'  => true
            )
        );

        register_post_meta(
            self::$post_type,
            'manual_rrule',
            array(
                'type'          => 'boolean',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => false
            )
        );

        register_post_meta(
            self::$post_type,
            'event_status',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'anonymous', // flag whether event was submitted by anonymous non logged in user
            array(
                'type'          => 'boolean',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => false
            )
        );

        register_post_meta(
            self::$post_type,
            'contact_name',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
            )
        );

        register_post_meta(
            self::$post_type,
            'contact_phone',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
            )
        );

        register_post_meta(
            self::$post_type,
            'contact_email',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
            )
        );

        register_post_meta(
            self::$post_type,
            'featured',
            array(
                'type'          => 'boolean',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => false
            )
        );

        register_post_meta(
            self::$post_type,
            'external_link',
            array(
                'type'          => 'object',
                'single'        => true,
                'show_in_rest'  => array(
                    'schema' => array(
                        'type' => 'object',
                        'properties' => array(
                            'url' => array(
                                'type' => 'string'
                            ),
                            'text' => array(
                                'type' => 'string'
                            )
                        )
                    )
                )
            )
        );

        register_post_meta(
            self::$post_type,
            'schedule',
            array(
                'type' => 'object',
                'single' => false,
                'show_in_rest' => array(
                    'schema' => array(
                        'type' => 'object',
                        'properties' => array(
                            'id' => array(
                                'type' => 'integer'
                            ),
                            'title' => array(
                                'type' => 'string'
                            ),
                            'start' => array(
                                'type' => 'string'
                            ),
                            'thumbnail' => array(
                                'type' => 'object',
                                'properties' => array(
                                    'type' => array(
                                        'type' => 'string'
                                    ),
                                    'icon' => array(
                                        'type' => 'string'
                                    ),
                                    'image' => array(
                                        'type' => 'array',
                                        'properties' => array(
                                            'thumbnail' => array(
                                                'type' => 'string'
                                            )
                                        )
                                    )
                                )
                            ),
                            'color' => array(
                                'type' => 'string'
                            ),
                            'details' => array(
                                'type' => 'string'
                            )
                        )
                    )
                )
            )
        );

        register_post_meta(
            self::$post_type,
            'attendance_method',
            array(
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => ''
            )
        );

        register_post_meta(
            self::$post_type,
            'attendance_private_list',
            array(
                'type'          => 'boolean',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => false
            )
        );

        register_post_meta(
            self::$post_type,
            'attendance_persons_per_rsvp',
            array(
                'type'          => 'integer',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => -1
            )
        );

        register_post_meta(
            self::$post_type,
            'attendance_persons_limit',
            array(
                'type'          => 'integer',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => -1
            )
        );

        register_post_meta(
            self::$post_type,
            'attendance_rsvp_schedule_start',
            array(
                'type'          => 'integer',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => -1
            )
        );

        register_post_meta(
            self::$post_type,
            'attendance_rsvp_schedule_end',
            array(
                'type'          => 'integer',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => -1
            )
        );

        register_post_meta(
            self::$post_type,
            'attendance_rsvp_allow_waiting_list',
            array(
                'type'          => 'boolean',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => false
            )
        );

        register_post_meta(
            self::$post_type,
            'attachments',
            array(
                'type' => 'object',
                'single' => false,
                'show_in_rest' => array(
                    'schema' => array(
                        'type' => 'object',
                        'properties' => array(
                            'id' => array(
                                'type' => 'number'
                            ),
                            'url' => array(
                                'type' => 'string'
                            ),
                            'caption' => array(
                                'type' => 'string',
                                'default' => ''
                            )
                        )
                    )
                )
            )
        );

        register_post_meta(
            self::$post_type,
            'products',
            array(
                'type'         => 'number',
                'single'       => false,
                'show_in_rest' => true
            )
        );

        register_post_meta(
            self::$post_type,
            'primary_ticket',
            array(
                'type'         => 'number',
                'single'       => true,
                'show_in_rest' => true
            )
        );

        register_post_meta(
            self::$post_type,
            'tickets',
            array(
                'type'         => 'number',
                'single'       => false,
                'show_in_rest' => true
            )
        );

        register_post_meta(self::$post_type, 'read_permission', array(
            'type'          => 'string',
            'single'        => false,
            'show_in_rest'  => true
        ));

        register_post_meta(self::$post_type, 'edit_permission', array(
            'type'          => 'string',
            'single'        => false,
            'show_in_rest'  => true,
        ));

        register_post_meta(self::$post_type, 'approved', array(
            'type'          => 'integer',
            'single'        => true,
            'show_in_rest'  => true,
            'default'       => 0
        ));

        register_post_meta(self::$post_type, 'author', array(
            'type'          => 'integer',
            'single'        => true,
            'show_in_rest'  => true,
            'default'       => -1
        ));

        register_post_meta(self::$post_type, 'super', array(
            'type'          => 'integer',
            'single'        => true,
            'show_in_rest'  => true,
            'default'       => -1
        ));

        register_post_meta(
            self::$post_type,
            'health_measures',
            array(
                'type' => 'object',
                'single' => true,
                'show_in_rest' => array(
                    'schema' => array(
                        'type' => 'object',
                        'properties' => array(
                            'require_masks' => array(
                                'type'    => 'boolean',
                                'default' => false,
                            ),
                            'require_temp' => array(
                                'type'    => 'boolean',
                                'default' => false,
                            ),
                            'require_distance' => array(
                                'type'    => 'boolean',
                                'default' => false,
                            ),
                            'require_tracing' => array(
                                'type'    => 'boolean',
                                'default' => false,
                            ),
                            'require_certificate' => array(
                                'type'    => 'boolean',
                                'default' => false,
                            ),
                            'require_pcr_test' => array(
                                'type'    => 'boolean',
                                'default' => false,
                            ),
                            'require_rapid_test' => array(
                                'type'    => 'boolean',
                                'default' => false,
                            ),
                            'custom' => array(
                                'type'    => 'string',
                                'default' => '',
                            )
                        )
                    )
                )
            )
        );

        register_post_meta(self::$post_type, 'author_notes', array(
            'type'          => 'string',
            'single'        => true,
            'show_in_rest'  => true,
            'default'       => ''
        ));

        register_post_meta(self::$post_type, 'uid', array(
            'type'          => 'string',
            'single'        => true,
            'show_in_rest'  => true,
        ));

        register_post_meta(self::$post_type, 'import_session', array(
            'type'          => 'string',
            'single'        => true,
            'show_in_rest'  => true,
        ));

        register_post_meta(self::$post_type, 'structure_id', array(
            'type'          => 'integer',
            'single'        => true,
            'show_in_rest'  => true,
            'default'       => 0
        ));

    }

    public static function register_custom_post_status() {

        register_post_status('stec_archived', array(
            'label'                     => esc_html_x('Archived', 'post'),
            'public'                    => false,
            'exclude_from_search'       => true,
            'show_in_admin_all_list'    => true,
            'show_in_admin_status_list' => true,
            'label_count'               => _n_noop('Archived (%s)', 'Archived (%s)'),
        ));
    }

    // Adds ?context=event for displaying event data on the front-end
    public static function register_event_context_schema($schema) {

        $context = 'event';

        // 1st level.
        foreach (array('id', 'title', 'content', 'excerpt', 'meta', 'stec_cal', 'stec_cat', 'stec_org', 'stec_gst', 'stec_loc') as $item) {
            if (is_array($schema['properties'][$item]['context'])) {
                $schema['properties'][$item]['context'][] = $context;
            }
        }

        // 2nd level for the 'rendered' part.
        foreach (array('content', 'excerpt', 'title') as $item) {
            if (is_array($schema['properties'][$item]['properties']['rendered']['context'])) {
                $schema['properties'][$item]['properties']['rendered']['context'][] = $context;
            }
        }

        return $schema;
    }

    // Check user has permission to read this event
    public static function before_single_page_template($template) {

        global $post;

        if (!is_a($post, 'WP_Post') || 'stec_event' !== $post->post_type) {
            return $template;
        }

        if (false === Permissions::current_user_has_post_permission($post, 'stec_event', 'read_permission')) {
            global $wp_query;
            $wp_query->set_404();
            status_header(404);
            $template = locate_template('404.php');
            return apply_filters('stec_404_template', $template);
        }

        // Make sure unapproved events are not publicly visible
        if (0 === (int) get_post_meta($post->ID, 'approved', true)) {

            $current_user_id = get_current_user_id();
            $event_author_id = (int) get_post_meta($post->ID, 'author', true);

            if (
                false === is_user_logged_in() ||
                (false === Permissions::get_is_super() && $current_user_id !== $event_author_id)
            ) {

                global $wp_query;
                $wp_query->set_404();
                status_header(404);
                $template = locate_template('404.php');
                return apply_filters('stec_404_template', $template);
            }
        }

        return apply_filters('stec_single_page_template', $template);
    }

    public static function register_scripts() {
        if (!wp_script_is('stec-single-init-js', 'registered')) {
            wp_register_script(
                'stec-single-init-js',
                STEC_LITE_PLUGIN_URL . 'assets/js/single-page/init.js',
                array('wp-element', 'wp-i18n', 'wp-jp-i18n-loader', 'moment-tz', 'lodash'),
                STEC_LITE_PLUGIN_VERSION,
                array(
                    'in_footer' => true,
                    'strategy'  => 'defer'
                )
            );
        }
    }

    public static function enqueue_single_scripts() {

        global $post;

        if (!is_a($post, 'WP_Post') || 'stec_event' !== $post->post_type) {
            return;
        }

        wp_enqueue_script('stec-single-init-js');
        wp_set_script_translations('stec-single-init-js', 'stec', STEC_LITE_PLUGIN_ABS_PATH . 'languages');

        do_action('stec_load_scripts', $post, 'stec-single-init-js');
    }

    public static function prefetch_event($event_id, $start_date) {

        $event = Events::get_rest_event(array(
            'id'              => $event_id,
            'start_date'      => $start_date,
            'context'         => 'event',
            'permission_type' => 'read_permission'
        ));

        $is_overrided = (bool) $event['meta']['recurrence_id'];

        if ($is_overrided) {
            // do not calculate offset for overrided event
            return $event;
        }

        $event_timezone         = Helpers::get_event_timezone($event_id);
        $initial_start_date     = $event['meta']['start_date'];
        $initial_start_date_utc = $event['meta']['start_date_utc'];
        $initial_end_date       = $event['meta']['end_date'];
        $initial_end_date_utc   = $event['meta']['end_date_utc'];
        $start_date_utc         = Helpers::get_datetime_utc($start_date, $event_timezone);
        $offset                 = Helpers::get_datetime_diff($start_date_utc, $initial_start_date_utc);
        $end_date_object        = new \DateTime($initial_end_date, new \DateTimeZone('UTC'));
        $end_date_object->modify('+' . $offset . ' seconds');
        $end_date = $end_date_object->format('Y-m-d\TH:i');
        $end_date_utc = Helpers::get_datetime_utc($end_date, $event_timezone);

        $event['initial_start_date']     = $initial_start_date;
        $event['initial_start_date_utc'] = $initial_start_date_utc;
        $event['initial_end_date']       = $initial_end_date;
        $event['initial_end_date_utc']   = $initial_end_date_utc;
        $event['meta']['start_date']     = $start_date;
        $event['meta']['start_date_utc'] = $start_date_utc;
        $event['meta']['end_date']       = $end_date;
        $event['meta']['end_date_utc']   = $end_date_utc;

        return $event;
    }

    public static function register_single_instance() {

        global $post;

        if (!is_a($post, 'WP_Post') || 'stec_event' !== $post->post_type) {
            return;
        }

        if (false === Permissions::current_user_has_post_permission($post, 'stec_event', 'read_permission')) {
            return;
        }

        $start_date = get_query_var('stec_event_start_date', false);

        if (false === $start_date) {
            // default to initial start date
            $start_date = get_post_meta($post->ID, 'start_date', true);
        }

        if (false === Helpers::is_valid_date($start_date)) {
            return;
        }

        $atts = array(
            'id'          => 'stec-single',
            'event_id'    => $post->ID,
            'offset_date' => $start_date
        );

        $defaults_from_settings = Settings::get_front_settings(array(
            'calendar',
            'layouts',
            'map',
            'comments',
            'dashboard'
        ));

        $atts = array_merge($atts, $defaults_from_settings);

        if (Settings::get('misc', 'events_prefetch')) {
            $atts['event_data'] = self::prefetch_event($post->ID, $start_date);
        }

        $atts = apply_filters('stec_single_page_atts', $atts);

        wp_add_inline_script('stec-single-init-js', sprintf('var stecSinglePageInstances = [%s];', wp_json_encode($atts)), 'before');
    }

    public static function rewrite_rules() {

        add_rewrite_tag('%stec_event_start_date%', '([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2})');
        add_rewrite_rule('^' . self::get_slug() . '/(.*)/([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2})/?', 'index.php?stec_event=$matches[1]&stec_event_start_date=$matches[2]', 'top');
    }

    public static function single_page_content($content) {

        global $post;

        if (
            false === is_a($post, 'WP_Post') ||
            'stec_event' !== $post->post_type ||
            false === is_single() ||
            false === in_the_loop() ||
            false === is_main_query()
        ) {
            return $content;
        }


        $content = '<div id="stec-single" class="stec-single-page"></div>';


        return $content;
    }
}

Post_Types_Stec_Event::init();

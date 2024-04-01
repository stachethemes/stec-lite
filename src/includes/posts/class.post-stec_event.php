<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Post_Types_Stec_Event {

    use Post_Trait_Helpers;

    private static $post_type = 'stec_event';

    public static function init() {

        add_action('init', array(__CLASS__, 'register_post'), 5);
        add_action('init', array(__CLASS__, 'register_meta'), 5);
        add_action('init', array(__CLASS__, 'register_custom_post_status'), 5);
        add_action('init', array(__CLASS__, 'rewrite_rules'), 10);
        add_filter('rest_stec_event_item_schema', array(__CLASS__, 'register_event_context_schema'), 5);
        add_action('wp_head', array(__CLASS__, 'add_og_tags'), 5);
        add_filter('template_include', array(__CLASS__, 'before_single_page_template'), 5);
        add_filter('the_content', array(__CLASS__, 'single_page_content'), 10);
    }

    public static function add_og_tags() {

        global $post;

        if (!is_a($post, 'WP_Post') || 'stec_event' !== $post->post_type) {
            return;
        }

        if (function_exists('wpseo_auto_load')) {
            return;
        }

        $custom_og = apply_filters('stec_single_og', false, $post->ID);

        if (false !== $custom_og) {

            $allowed_html = array(
                'meta' => array(
                    'name'     => array(),
                    'property' => array(),
                    'content'  => array(),
                ),
            );

            echo wp_kses($custom_og, $allowed_html);

            return;
        }

        $event_id    = $post->ID;
        $event_title = get_the_title($event_id);
        $excerpt     = get_the_excerpt($event_id);
        $thumbnail   = get_the_post_thumbnail_url($event_id, 'full');
        $permalink   = get_permalink($event_id);
        $start_date  = get_query_var('stec_event_start_date', '');

        if ($start_date) {
            $permalink .= '/' . $start_date;
        }

        // * Open Graph
        $og_tags = array(
            'og:title'       => $event_title,
            'og:type'        => 'article',
            'og:description' => $excerpt,
            'og:image'       => $thumbnail,
            'og:url'         => $permalink,
        );

        foreach ($og_tags as $tag => $value) {
            printf('<meta property="%s" content="%s" />' . PHP_EOL, esc_attr($tag), esc_attr($value));
        }

        // * Twitter
        $tw =  array(
            'twitter:card'        => 'summary_large_image',
            'twitter:title'       => $event_title,
            'twitter:description' => $excerpt,
            'twitter:image'       => $thumbnail,
            'twitter:domain'      => get_bloginfo('name'),
            'twitter:url'         => $permalink,
        );

        foreach ($tw as $tag => $value) {
            if ($value) {
                $type_property = array('twitter:domain', 'twitter:url');
                $type          = in_array($tag, $type_property) ? 'name' : 'property';
                printf('<meta %s="%s" content="%s" />' . PHP_EOL, esc_attr($type), esc_attr($tag), esc_attr($value));
            }
        }
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
                'labels'                => self::get_post_labels(esc_html__('Event', 'stachethemes_event_calendar_lite'), esc_html__('Events', 'stachethemes_event_calendar_lite')),
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
                'supports'              => array('title', 'editor', 'thumbnail', 'excerpt', 'comments', 'custom-fields', 'author'),
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

        register_post_meta(self::$post_type, 'lang', array(
            'type'          => 'string',
            'single'        => true,
            'show_in_rest'  => true,
        ));
    }

    public static function register_custom_post_status() {

        register_post_status('stec_archived', array(
            'label'                     => esc_html__('Archived', 'stachethemes_event_calendar_lite'),
            'public'                    => false,
            'exclude_from_search'       => true,
            'show_in_admin_all_list'    => true,
            'show_in_admin_status_list' => true,
            // translators: %s: post count
            'label_count'               => _n_noop('Archived (%s)', 'Archived (%s)', 'stachethemes_event_calendar_lite'),
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

    public static function rewrite_rules() {

        add_rewrite_tag('%stec_event_start_date%', '([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2})');
        add_rewrite_rule('^' . self::get_slug() . '/(.*)/([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2})/?', 'index.php?stec_event=$matches[1]&stec_event_start_date=$matches[2]', 'top');
    }

    public static function single_page_content($content) {

        global $post;
        global $wp_query;

        if (
            false === is_a($post, 'WP_Post') ||
            'stec_event' !== $post->post_type ||
            false === is_single() ||
            false === in_the_loop() ||
            false === is_main_query() ||
            isset($wp_query->query_vars['stec_doing_prefetch'])
        ) {
            return $content;
        }

        // * Call [stec_single] shortcode
        $start_date = get_query_var('stec_event_start_date', '');
        $content    = do_shortcode(
            sprintf(
                '[stec_single event_id="%s" offset_date="%s" ]',
                absint($post->ID),
                sanitize_text_field($start_date)
            )
        );

        return $content;
    }
}

Post_Types_Stec_Event::init();

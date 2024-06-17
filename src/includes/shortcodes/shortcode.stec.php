<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * [stec] Shortcode class
 */
class Shortcode_Stec {

    use Shortcode_Attributes;
    use Shortcode_Force_Load;
    use Shortcode_Helpers;

    private static $prefetched_events = array();

    public static function init() {

        add_action('wp_enqueue_scripts', array(__CLASS__, 'register_scripts'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'load_scripts'));

        /**
         * [stec] Shortcode
         * - Adds html container for the calendar
         * - Registers an js instance
         */
        add_shortcode('stec',  array(__CLASS__, 'register_shortcode'));

        /**
         * [stachethemes_ec]
         * Legacy shortcode
         */
        add_shortcode('stachethemes_ec',  array(__CLASS__, 'register_shortcode'));
    }

    public static function register_scripts() {

        /**
         * Register stec-init-js hook that lazy loads 
         * the actual front calendar and its assets
         * 
         * The hook expects you already have a js instance ( window.stecInstances ) with 
         * instance arrays and an html container with the id
         * 
         * Each instance object in window.stecInstances should contain the 
         * calendar instance parameters ( id etc... )
         */

        wp_register_script(
            'stec-init-js',
            STEC_LITE_PLUGIN_URL . 'assets/js/calendar/init.js',
            array('wp-i18n', 'wp-jp-i18n-loader', 'wp-element', 'moment-tz', 'lodash'),
            STEC_LITE_PLUGIN_VERSION,
            array(
                'in_footer' => true,
                'strategy'  => 'defer'
            )
        );
    }

    public static function load_scripts($force = false) {

        if (wp_script_is('stec-init-js', 'enqueued')) {
            return;
        }

        global $post;

        $force = self::scripts_are_forced('stec') || $force;

        if ($force || true === self::has_shortcode('stec') || true === self::has_shortcode('stachethemes_ec')) {
            wp_enqueue_script('stec-init-js');
            wp_set_script_translations('stec-init-js', 'stachethemes_event_calendar_lite', STEC_LITE_PLUGIN_ABS_PATH . 'languages');
        }

        if (Settings::get('dashboard', 'wpmedia')) {
            wp_enqueue_media();
        }

        do_action('stec_load_scripts', $post, 'stec-init-js');
    }

    public static function get_default_atts() {

        $defaults_from_settings = Settings::get_front_settings(array(
            'calendar',
            'layouts',
            'map',
            'comments',
            'dashboard',
            'misc'
        ));

        $default_atts = array(
            'id'                                      => uniqid('stec-'),
            'filter__organizer'                       => 'atom_default',
            'filter__location'                        => 'atom_default',
            'filter__guest'                           => 'atom_default',
            'filter__category'                        => 'atom_default',
            'filter__calendar'                        => 'atom_default',
            'filter__min_date'                        => 'atom_default',
            'filter__max_date'                        => 'atom_default',
            'filter__minmax_intersect'                => 'atom_default',
            'filter__start_date'                      => 'atom_default',
            'filter__featured'                        => 'atom_default',
            'filter__read_permission'                 => 'atom_default',
            'filter__author'                          => 'atom_default',
            'filter__events'                          => 'atom_default',
            'calendar__dow'                           => 'atom_default',
            'calendar__show_tz_offset'                => 'atom_default',
            'calendar__use_user_timezone'             => 'atom_default',
            'calendar__date_format'                   => 'atom_default',
            'calendar__time_format'                   => 'atom_default',
            'calendar__top_enabled'                   => 'atom_default',
            'calendar__top_today_button'              => 'atom_default',
            'calendar__top_nav_buttons'               => 'atom_default',
            'calendar__top_datepicker_menu'           => 'atom_default',
            'calendar__top_search_menu'               => 'atom_default',
            'calendar__top_filters_menu'              => 'atom_default',
            'calendar__top_layouts_menu'              => 'atom_default',
            'calendar__top_inline_categories'         => 'atom_default',
            'calendar__top_categories_start_inactive' => 'atom_default',
            'calendar__layouts'                       => 'atom_default',
            'calendar__layout'                        => 'atom_default',
            'calendar__open_events_in'                => 'atom_default',
            'calendar__links_target'                  => 'atom_default',
            'layouts__agenda_list_more_button'        => 'atom_default',
            'layouts__agenda_list_next_button'        => 'atom_default',
            'layouts__agenda_list_reverse_order'      => 'atom_default',
            'layouts__agenda_list'                    => 'atom_default',
            'layouts__agenda_list_limit'              => 'atom_default',
            'layouts__agenda_slider'                  => 'atom_default',
            'layouts__grid_image_auto_height'         => 'atom_default',
            'layouts__grid_gutter'                    => 'atom_default',
            'layouts__grid_columns'                   => 'atom_default',
            'layouts__grid_limit'                     => 'atom_default',
            'layouts__grid_more_button'               => 'atom_default',
            'layouts__grid_next_button'               => 'atom_default',
            'layouts__grid_reverse_order'             => 'atom_default',
            'layouts__boxgrid_gutter'                 => 'atom_default',
            'layouts__boxgrid_columns'                => 'atom_default',
            'layouts__boxgrid_limit'                  => 'atom_default',
            'layouts__boxgrid_more_button'            => 'atom_default',
            'layouts__boxgrid_next_button'            => 'atom_default',
            'layouts__boxgrid_reverse_order'          => 'atom_default',
            'layouts__month_week_image_auto_height'   => 'atom_default',
            'layouts__month_week_force_title'         => 'atom_default',
            'layouts__month_week_es_form_on_top'      => 'atom_default',
            'layouts__month_week_style'               => 'atom_default',
            'layouts__month_week_quick_open'          => 'atom_default',
            'layouts__month_week_tooltip'             => 'atom_default',
            'layouts__month_week_counter'             => 'atom_default',
            'layouts__month_week_short_desc'          => 'atom_default',
            'layouts__map_zoom'                       => 'atom_default',
            'map__type'                               => 'atom_default',
            'map__gmap_api_key'                       => 'atom_default',
            'comments__type'                          => 'atom_default',
            'dashboard__in_calendar'                  => 'atom_default',
            'misc__address_order'                     => 'atom_default',
            'misc__min_allowed_year'                  => 'atom_default',
            'misc__max_allowed_year'                  => 'atom_default',
            'misc__tiny_mce_enabled'                  => 'atom_default',
            'misc__tiny_mce_api_key'                  => 'atom_default',
            'misc__events_per_request'                => 'atom_default'
        );

        $default_atts = Helpers::wp_parse_args($defaults_from_settings, $default_atts);

        return $default_atts;
    }

    /**
     * Convert some special case parameters in the shortcode server side
     */
    public static function process_special_cases($shortcode_atts) {

        return $shortcode_atts;
    }

    /**
     * Converts alias parameters to their actual parameters
     */
    public static function convert_aliases($atts) {

        $alias_array = array(
            'views'                    => 'calendar__layouts',
            'view'                     => 'calendar__layout',
            'layout'                   => 'calendar__layout',
            'cal'                      => 'filter__calendar',
            'cat'                      => 'filter__category',
            'loc'                      => 'filter__location',
            'org'                      => 'filter__organizer',
            'gst'                      => 'filter__guest',
            'calendar'                 => 'filter__calendar',
            'category'                 => 'filter__category',
            'location'                 => 'filter__location',
            'organizer'                => 'filter__organizer',
            'guest'                    => 'filter__guest',
            'stec_cal'                 => 'filter__calendar',
            'stec_cat'                 => 'filter__category',
            'stec_loc'                 => 'filter__location',
            'stec_org'                 => 'filter__organizer',
            'stec_gst'                 => 'filter__guest',
            'min_date'                 => 'filter__min_date',
            'max_date'                 => 'filter__max_date',
            'minmax_intersect'         => 'filter__minmax_intersect',
            'start_date'               => 'filter__start_date',
            'featured'                 => 'filter__featured',
            'author'                   => 'filter__author',
            'events'                   => 'filter__events',
            'include'                  => 'filter__events',
            'min_allowed_year'         => 'misc__min_allowed_year',
            'max_allowed_year'         => 'misc__max_allowed_year'
        );

        foreach ($alias_array as $alias => $param) {
            if (isset($atts[$alias])) {
                $atts[$param] = $atts[$alias];
                unset($atts[$alias]);
            }
        }

        return $atts;
    }

    /**
     * Fetches events if they are not already fetched
     * and returns the hash of the serialized request arguments
     * the hash is used to identify the prefetched events in the js window.stecPrefetchedEvents object
     * 
     * @param array $atts shortcode attributes
     * @return array serialized request args hash with hash- prefix or empty string on error
     */
    public static function get_prefetched_events_hash($atts) {

        $request_args = array();

        /**
         * Converts shortcode attributes to request arguments
         * There are the relevant attributes for the events request query
         */
        $convert = array(
            'filter__minmax_intersect'  => 'minmax_intersect',
            'filter__calendar'          => 'calendar',
            'filter__category'          => 'category',
            'filter__guest'             => 'guest',
            'filter__organizer'         => 'organizer',
            'filter__location'          => 'location',
            'filter__min_date'          => 'min_date',
            'filter__max_date'          => 'max_date',
            'filter__featured'          => 'featured',
            'filter__read_permission'   => 'read_permission',
            'filter__author'            => 'author',
            'filter__events'            => 'include'
        );

        foreach ($atts as $param => $value) {

            if (isset($convert[$param]) && $value !== 'atom_default') {
                $request_args[$convert[$param]] = $value;
            }
        }

        $request_hash = 'hash-' . md5(serialize($request_args));

        if (isset(self::$prefetched_events[$request_hash])) {
            return $request_hash;
        }

        $events = Events::get_rest_events($request_args);

        if ($events instanceof \WP_Error) {
            return '';
        }

        self::$prefetched_events[$request_hash] = $events;

?>
        <script type="text/javascript">
            if (typeof window.stecPrefetchedEvents === 'undefined') {
                window.stecPrefetchedEvents = {};
            }

            if (typeof <?php printf('window.stecPrefetchedEvents["%s"]', esc_js($request_hash)) ?> === 'undefined') {
                <?php printf('window.stecPrefetchedEvents["%s"]', esc_js($request_hash)) ?> = <?php echo wp_json_encode($events); ?>;
            }
        </script>
    <?php

        return $request_hash;
    }

    public static function register_shortcode($atts = array()) {

        ob_start();

        if (false === is_array($atts)) {
            $atts = array();
        }

        $atts = self::convert_aliases($atts);

        $default_atts = self::get_default_atts();

        $shortcode_atts = shortcode_atts(
            $default_atts,
            $atts,
            'stec'
        );

        $shortcode_atts = apply_filters('stec_shortcode_atts', $shortcode_atts);
        $shortcode_atts = self::convert_attributes($shortcode_atts);
        $shortcode_atts = self::process_special_cases($shortcode_atts);

        if (true === (bool) $shortcode_atts['misc__events_prefetch']) {
            $shortcode_atts['prefetched_events_hash'] = self::get_prefetched_events_hash($shortcode_atts);
        }

        printf('<div id="%s" class="stec-instance"></div>', esc_attr($shortcode_atts['id']));

    ?>

        <script type="text/javascript">
            (function() {

                const instance = <?php echo wp_json_encode($shortcode_atts); ?>;

                if (typeof window.stecInstances === 'undefined') {
                    window.stecInstances = [];
                }

                window.stecInstances.push(instance);

            })();
        </script>

<?php

        return ob_get_clean();
    }
}

Shortcode_Stec::init();

<?php

namespace Stachethemes\Steclite;

/**
 * [stec_events_slider] Shortcode class
 */
class Shortcode_Stec_Events_Slider {

    use Shortcode_Attributes;
    use Shortcode_Force_Load;
    use Shortcode_Helpers;

    private static $prefetched_events = array();

    public static function init() {

        add_action('wp_enqueue_scripts', array(__CLASS__, 'register_scripts'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'load_scripts'));
        add_action('enqueue_block_assets', array(__CLASS__, 'load_scripts'));


        /**
         * [stec_events_slider] Shortcode
         * - Adds html container for the form
         * - Registers an js instance
         */
        add_shortcode('stec_events_slider',  array(__CLASS__, 'register_shortcode'));
    }

    public static function register_scripts() {

        /**
         * Register stec-widget-events-slider hook that lazy loads 
         * 
         * The hook expects you already have a js instance ( window.stecEventsSliderInstances ) with 
         * instance arrays and an html container with the id
         * 
         * Each instance object in window.stecEventsSliderInstances should contain the 
         * form instance parameters ( id etc... )
         */

        wp_register_script(
            'stec-widget-events-slider',
            STEC_LITE_PLUGIN_URL . 'assets/js/widgets/events-slider/front.js',
            array('wp-element', 'moment-tz', 'wp-i18n', 'wp-jp-i18n-loader', 'lodash'),
            STEC_LITE_PLUGIN_VERSION,
            array(
                'in_footer' => true,
                'strategy'  => 'defer'
            )
        );
    }

    public static function load_scripts($force = false) {

        if (wp_script_is('stec-widget-events-slider', 'enqueued')) {
            return;
        }

        global $post;

        $force = self::scripts_are_forced('stec_events_slider') || $force;

        if ($force || true === self::has_shortcode('stec_events_slider')) {
            wp_enqueue_script('stec-widget-events-slider');
            wp_set_script_translations('stec-widget-events-slider', 'stec', STEC_LITE_PLUGIN_ABS_PATH . 'languages');
        }

        do_action('stec_load_scripts', $post, 'stec-widget-events-slider');
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
            'filter__events'    => 'include',
            'filter__calendar'  => 'stec_cal',
            'filter__category'  => 'stec_cat',
            'filter__location'  => 'stec_loc',
            'filter__organizer' => 'stec_org',
            'filter__featured'  => 'featured_only',
            'featured'          => 'featured_only',
            'calendar'          => 'stec_cal',
            'category'          => 'stec_cat',
            'location'          => 'stec_loc',
            'organizer'         => 'stec_org',
            'guest'             => 'stec_gst',
            'cal'               => 'stec_cal',
            'cat'               => 'stec_cat',
            'loc'               => 'stec_loc',
            'org'               => 'stec_org',
            'gst'               => 'stec_gst',
            'filter__min_date'  => 'min_date',
            'filter__max_date'  => 'max_date'
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
            'stec_cal'                  => 'calendar',
            'stec_cat'                  => 'category',
            'stec_gst'                  => 'guest',
            'stec_org'                  => 'organizer',
            'stec_loc'                  => 'location',
            'min_date'                  => 'min_date',
            'max_date'                  => 'max_date',
            'featured_only'             => 'featured',
            'author'                    => 'author',
            'include'                   => 'include'
        );

        foreach ($atts as $param => $value) {

            if (isset($convert[$param])) {

                if (is_bool($value)) {
                    $value = $value ? 1 : 0;
                }

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

            if (typeof <?php printf('window.stecPrefetchedEvents["%s"]', $request_hash) ?> === 'undefined') {
                <?php printf('window.stecPrefetchedEvents["%s"]', $request_hash) ?> = <?php echo wp_json_encode($events); ?>;
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

        $default_atts = array();

        $defaults_from_settings = array(
            'id'                    => uniqid('stec-widget-events-slider-'),
            'min_date'              => 'start_of_this_month',
            'max_date'              => 'end_of_this_month',
            'min_date_custom'       => '',
            'max_date_custom'       => '',
            'gutter'                => 0,
            'limit'                 => 5,
            'columns'               => 3,
            'order'                 => 'asc',
            'open_events_in'        => '_self',
            'title'                 => '',
            'event_status'          => '',
            'display_tags'          => true,
            'display_categories'     => true,
            'display_thumbnail'     => true,
            'display_tickets'       => true,
            'display_categories'    => true,
            'display_description'   => true,
            'slider_bullets'        => true,
            'slider_arrows'         => true,
            'featured_only'         => false,
            'prefer_external_link'  => false,
            'thumbnail_source'      => Settings::get('calendar', 'thumbnail_source'),
            'tickets_btn_label'     => esc_html_x('Tickets', 'Button label', 'stec'),
            'stec_cal'              => '',
            'stec_cat'              => '',
            'stec_loc'              => '',
            'stec_org'              => '',
            'include'               => '',
            'author'                => '',
            'auto_slide'            => 0,
            'events_prefetch'       => false,
            'events_prefetch'       => Settings::get('misc', 'events_prefetch', false),
            'per_page'              => Settings::get('misc', 'events_per_request', 100)
        );

        $default_atts = Helpers::wp_parse_args($defaults_from_settings, $default_atts);

        $shortcode_atts = shortcode_atts(
            $default_atts,
            $atts,
            'stec_events_slider'
        );

        $shortcode_atts = apply_filters('stec_widget_events_slider_atts', $shortcode_atts);
        $shortcode_atts = self::convert_attributes($shortcode_atts);
        $shortcode_atts = self::process_special_cases($shortcode_atts);

        if (true === (bool) $shortcode_atts['events_prefetch']) {
            $shortcode_atts['prefetched_events_hash'] = self::get_prefetched_events_hash($shortcode_atts);
        }

        printf('<div id="%s" class="stec-widget-events-slider"></div>', $shortcode_atts['id']);

?>

        <script type="text/javascript">
            (function() {

                const instance = <?php echo wp_json_encode($shortcode_atts); ?>;

                if (typeof window.stecEventsSliderInstances === 'undefined') {
                    window.stecEventsSliderInstances = [];
                }

                window.stecEventsSliderInstances.push(instance);

            })();
        </script>

<?php

        return ob_get_clean();
    }
}

Shortcode_Stec_Events_Slider::init();

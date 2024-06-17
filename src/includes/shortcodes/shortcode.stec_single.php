<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * [stec_single] Shortcode class
 */
class Shortcode_Stec_Single {

    use Shortcode_Attributes;
    use Shortcode_Force_Load;
    use Shortcode_Helpers;

    public static function init() {

        add_action('wp_enqueue_scripts', array(__CLASS__, 'register_scripts'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'load_scripts'));

        /**
         * [stec_single] Shortcode
         */
        add_shortcode('stec_single',  array(__CLASS__, 'register_shortcode'));
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

    public static function load_scripts($force = false) {

        if (wp_script_is('stec-single-init-js', 'enqueued')) {
            return;
        }

        global $post;

        $force = self::scripts_are_forced('stec_single') || $force;

        if ($force || true === self::has_shortcode('stec_single') || (is_object($post) && 'stec_event' === $post->post_type)) {
            wp_enqueue_script('stec-single-init-js');
            wp_set_script_translations('stec-single-init-js', 'stachethemes_event_calendar_lite', STEC_LITE_PLUGIN_ABS_PATH . 'languages');
            do_action('stec_load_scripts', $post, 'stec-single-init-js');
        }
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

    public static function register_single_instance($atts) {

        $post_id = $atts['event_id'];
        $post    = get_post($post_id);

        if (!is_a($post, 'WP_Post') || 'stec_event' !== $post->post_type) {
            return;
        }

        if (false === Permissions::current_user_has_post_permission($post, 'stec_event', 'read_permission')) {
            return;
        }

        $start_date = $atts['offset_date'];

        if (!$start_date) {
            // default to initial start date
            $start_date = get_post_meta($post->ID, 'start_date', true);
        }

        $defaults_from_settings = Settings::get_front_settings(array(
            'calendar',
            'layouts',
            'map',
            'submit_form',
            'attendance',
            'reminders',
            'forecast',
            'captcha',
            'comments',
            'builder',
            'dashboard'
        ));

        $atts = array_merge($atts, $defaults_from_settings);

        if (Settings::get('misc', 'events_prefetch')) {
            $atts['event_data'] = self::prefetch_event($post->ID, $start_date);
        }

?>

        <script type="text/javascript">
            (function() {

                const instance = <?php echo wp_json_encode($atts); ?>;

                if (typeof window.stecSinglePageInstances === 'undefined') {
                    window.stecSinglePageInstances = [];
                }

                window.stecSinglePageInstances.push(instance);

            })();
        </script>

<?php
    }

    public static function register_shortcode($atts = array()) {

        if (!is_array($atts) || !isset($atts['event_id'])) {
            return;
        }

        $defaults = array(
            'id'          => wp_unique_id('stec-single-'),
            'event_id'    => false,
            'offset_date' => false,
        );

        $atts           = Helpers::wp_parse_args($atts, $defaults);
        $shortcode_atts = apply_filters('stec_single_shortcode_atts', $atts);

        ob_start();
        printf('<div id="%s" class="stec-single-page"></div>', esc_attr($shortcode_atts['id']));
        self::register_single_instance($shortcode_atts);
        return ob_get_clean();
    }
}

Shortcode_Stec_Single::init();

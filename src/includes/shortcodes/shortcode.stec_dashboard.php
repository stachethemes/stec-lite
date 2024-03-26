<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * [stec_dashboard] Shortcode class
 */
class Shortcode_Stec_Dashboard {

    use Shortcode_Helpers;
    use Shortcode_Force_Load;

    public static function init() {

        add_action('admin_enqueue_scripts', array(__CLASS__, 'register_scripts'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'register_scripts'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'load_scripts'));

        /**
         * [stec_dashboard] Shortcode
         * - Adds html container for the dashboard
         * - Registers an js instance
         */
        add_shortcode('stec_dashboard',  array(__CLASS__, 'register_shortcode'));
    }

    public static function register_scripts() {

        /**
         * Register stec-admin-dashboard hook that lazy loads 
         * the actual dashboard and its assets
         * 
         * The hook expects you already have a js instance ( window.stecDashboardInstances ) with 
         * instance arrays and an html container with the id
         * 
         * Each instance object in window.stecDashboardInstances should contain the 
         * instance parameters ( id etc... )
         */

        wp_register_script(
            'stec-admin-dashboard-js',
            STEC_LITE_PLUGIN_URL . 'assets/js/dashboard/init.js',
            array('wp-element', 'wp-jp-i18n-loader', 'moment', 'moment-tz', 'wp-i18n', 'lodash'),
            STEC_LITE_PLUGIN_VERSION,
            array(
                'in_footer' => true,
                'strategy'  => 'defer'
            )
        );
    }

    public static function load_scripts($force = false) {

        if (wp_script_is('stec-admin-dashboard-js', 'enqueued')) {
            return;
        }

        global $post;

        $force = self::scripts_are_forced('stec_dashboard') || $force;

        if ($force || true === self::has_shortcode('stec_dashboard')) {
            wp_enqueue_script('stec-admin-dashboard-js');
            wp_set_script_translations('stec-admin-dashboard-js', 'stachethemes_event_calendar_lite', STEC_LITE_PLUGIN_ABS_PATH . 'languages');
        }

        if (Settings::get('dashboard', 'wpmedia')) {
            wp_enqueue_media();
        }

        do_action('stec_load_scripts', $post, 'stec-admin-dashboard-js');
    }

    public static function register_shortcode($atts = array()) {

        ob_start();

        if (false === is_array($atts)) {
            $atts = array();
        }

        $default_atts = array(
            'id' => wp_unique_id('stec-dashboard-'),
        );

        $shortcode_atts = shortcode_atts(
            $default_atts,
            $atts,
            'stec_dashboard'
        );

        $shortcode_atts = apply_filters('stec_dashboard_shortcode_atts', $shortcode_atts);

        // Cast any numeric value found to number
        foreach ($shortcode_atts as &$att) {
            if (is_numeric($att)) {
                $att = (float) $att;
            }
        }

        printf('<div id="%s"></div>', esc_attr($shortcode_atts['id']));

?>

        <script type="text/javascript">
            (function() {

                const instance = <?php echo wp_json_encode($shortcode_atts); ?>;

                if (typeof window.stecDashboardInstances === 'undefined') {
                    window.stecDashboardInstances = [];
                }

                window.stecDashboardInstances.push(instance);

            })();
        </script>

<?php

        return ob_get_clean();
    }
}

Shortcode_Stec_Dashboard::init();

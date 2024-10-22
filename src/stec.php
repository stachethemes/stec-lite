<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

define('STEC_LITE_PLUGIN_FILE', __FILE__);

class Stachethemes_Event_Calendar {

    public $version = '5.3.2';

    private static $instance;

    /**
     * List with all calendar entries scripts hook names
     */
    private $entries = array(
        'stec-widget-admin-events-slider',
        'stec-widget-admin-events-list',
        'stec-widget-admin-stec',
        'stec-widget-events-slider',
        'stec-widget-events-list',
        'stec-admin-dashboard-js',
        'stec-single-init-js',
        'stec-init-js'
    );

    public function __wakeup() {
        _doing_it_wrong(__FUNCTION__, esc_html__('Unserializing instances of this class is forbidden.', 'stachethemes_event_calendar_lite'), esc_attr($this->version));
    }

    public function __clone() {
        _doing_it_wrong(__FUNCTION__, esc_html__('Cloning is forbidden.', 'stachethemes_event_calendar_lite'), esc_attr($this->version));
    }

    public static function get_instance() {

        if (null === static::$instance) {
            static::$instance = new static();
        }

        return static::$instance;
    }


    private function __construct() {
        add_action('plugins_loaded', array($this, 'init'), 0);
    }

    public function init() {

        /**
         * Check if Premium version is installed
         */
        if (class_exists('\Stachethemes\Stec\Stachethemes_Event_Calendar')) {

            add_action('admin_notices', function () {
                printf('<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', sprintf(
                    // translators: %1$s: Premium plugin name, %2$s: Lite plugin name, %3$s: Lite plugin version
                    esc_html__('%1$s is already installed. Please deactivate it before activating %2$s %3$s.', 'stachethemes_event_calendar_lite'),
                    '<strong>' . esc_html__('Stachethemes Event Calendar', 'stachethemes_event_calendar_lite') . '</strong>',
                    '<strong>' . esc_html__('Stachethemes Event Calendar Lite', 'stachethemes_event_calendar_lite') . '</strong>',
                    '<strong>' . esc_attr($this->version) . '</strong>'
                ));
            });

            return;
        }

        $this->define_constants();

        add_action('init', array($this, 'load_textdomain'), 5);
        add_filter('script_loader_tag', array($this, 'add_script_attributes'), 10, 2);
        add_filter('style_loader_tag', array($this, 'add_style_attributes'), 10, 4);
        add_action('wp_enqueue_scripts', array($this, 'register_dep_script_hooks'), 5);
        add_action('admin_enqueue_scripts', array($this, 'register_dep_script_hooks'), 5);
        add_action('wp_footer', array($this, 'register_js_constants'), 10);
        add_action('admin_footer', array($this, 'register_js_constants'), 10);
        add_action('wp_head', array($this, 'load_font_awesome'), 10);
        add_action('admin_head', array($this, 'load_font_awesome'), 10);
        add_action('wp_head', array($this, 'enqueue_general_css'), 11);
        add_action('wp_ajax_stec_rest_nonce', array($this, 'return_rest_nonce_response'));
        add_action('wp_ajax_nopriv_stec_rest_nonce', array($this, 'return_rest_nonce_response'));

        $this->includes();
    }

    public function return_rest_nonce_response() {
        wp_send_json_success(wp_create_nonce('wp_rest'));
    }

    private function define_constants() {
        defined('STEC_LITE_PLUGIN_VERSION') ? null : define('STEC_LITE_PLUGIN_VERSION', $this->version);
        defined('STEC_LITE_PLUGIN_ABS_PATH') ? null : define('STEC_LITE_PLUGIN_ABS_PATH', dirname(STEC_LITE_PLUGIN_FILE) . '/');
        defined('STEC_LITE_PLUGIN_BASENAME') ? null : define('STEC_LITE_PLUGIN_BASENAME', plugin_basename(STEC_LITE_PLUGIN_FILE));
        defined('STEC_LITE_PLUGIN_RELPATH') ? null : define('STEC_LITE_PLUGIN_RELPATH', dirname(plugin_basename(STEC_LITE_PLUGIN_FILE)) . '/');
        defined('STEC_LITE_PLUGIN_URL') ? null : define('STEC_LITE_PLUGIN_URL', plugin_dir_url(STEC_LITE_PLUGIN_FILE));
    }

    public function includes() {
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/o.exception.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/class.tools.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/libs/automatic/vendor/autoload.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/class.permissions.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/load.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/posts/load.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/shortcodes/load.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/widgets/load.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/admin-menu.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/class.helpers.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/class.settings.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/install/load.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/class.rest-misc-controller.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/class.events.php';
        include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/class.db-updater.php';
    }

    /**
     * Check if calendar script is loaded on page
     */
    public function has_calendar_entries() {

        foreach ($this->entries as $entry_script) {
            if (wp_script_is($entry_script)) {

                return true;
            }
        }

        return false;
    }

    public function load_textdomain() {
        load_plugin_textdomain('stachethemes_event_calendar_lite', false, STEC_LITE_PLUGIN_RELPATH . 'languages');
    }

    /**
     * Insert general css and css variables
     */
    public function enqueue_general_css() {
        if ($this->has_calendar_entries() || apply_filters('stec_force_general_css', false)) {
            $css = Settings::get_general_css();
            printf('<style>%s</style>', esc_js($css));
        }
    }

    /**
     * Javascript constants required for the plugin to work properly
     */
    public function register_js_constants() {

        if (!$this->has_calendar_entries()) {
            return;
        }

        $activator     = get_option('stec_activator');
        $activator_key = isset($activator['key']) ? $activator['key'] : '';
        $is_activated  = (bool) $activator_key;
        $user          = array();

        if (is_user_logged_in()) {

            $userid   = get_current_user_id();
            $userdata = get_userdata($userid);

            if ($userdata instanceof \WP_User) {

                $user = array(
                    'id'    => $userdata->ID,
                    'name'  => $userdata->user_nicename,
                    'email' => $userdata->user_email,
                    'avatar' => get_avatar_url($userdata->ID)
                );
            }
        }

        $user_calendars = get_terms(array(
            'taxonomy'   => 'stec_cal',
            'hide_empty' => false,
            'fields'     => 'ids',
            'per_page'   => -1,
            'meta_query' => array(
                'relation' => 'OR',
                array(
                    'key'     => 'edit_permission',
                    'value'   => Permissions::get_user_permissions_list(),
                    'compare' => 'IN'
                ),
                array(
                    'key'     => 'author',
                    'value'   => get_current_user_id(),
                    'compare' => '='
                )
            )
        ));

        $constants = array(
            'version'          => STEC_LITE_PLUGIN_VERSION,
            'plugin_url'       => STEC_LITE_PLUGIN_URL,
            'ajax_url'         => admin_url('admin-ajax.php'),
            'rest_url'         => get_rest_url(),
            'api_nonce'        => wp_create_nonce('wp_rest'),
            'wptz'             => wp_timezone_string(),
            'workers_url'      => STEC_LITE_PLUGIN_URL . 'assets/js/workers/',
            'rrule_url'        => STEC_LITE_PLUGIN_URL . 'assets/js/libs/rrule-tz.min.js',
            'moment_url'       => includes_url('js/dist/vendor/moment.js'),
            'moment_tz_url'    => STEC_LITE_PLUGIN_URL . 'assets/js/libs/moment-tz.js',
            'current_user'     => array(
                'data' => $user,
                'capability' => array(
                    'super'                     => Permissions::get_is_super(),
                    'access_dashboard'          => current_user_can('stec_access_dashboard'),
                    'manage_settings'           => current_user_can('manage_stec_settings'),
                    'manage_events'             => current_user_can('manage_stec_event'),
                    'manage_calendars'          => current_user_can('manage_stec_cal'),
                    'manage_categories'         => current_user_can('manage_stec_cat'),
                    'manage_locations'          => current_user_can('manage_stec_loc'),
                    'manage_organizers'         => current_user_can('manage_stec_org'),
                    'manage_guests'             => current_user_can('manage_stec_gst'),
                    'moderate'                  => array(
                        'stec_cal'              => $user_calendars
                    ),
                    'upload_images'             => current_user_can('stec_upload_images'),
                    'upload_files'              => current_user_can('upload_files'),
                    'edit_users'                => current_user_can('edit_users'),
                    'verify_persons'            => current_user_can('stec_verify_persons')
                )
            ),
            'wpdate_format'        => get_option('date_format'),
            'wptime_format'        => get_option('time_format'),
            'date_format'          => Settings::get('calendar', 'date_format'),
            'time_format'          => Settings::get('calendar', 'time_format'),
            'show_tz_offset'       => Settings::get('calendar', 'show_tz_offset'),
            'use_user_tz'          => Settings::get('calendar', 'use_user_timezone'),
            'activated'            => $is_activated,
            'i18n_translate_all'   => Settings::get('lang', 'i18n_translate_all'),
            'i18n_loader'          => Settings::get('lang', 'i18n_loader'),
            'tiny_mce'             => array(
                'enabled' => Settings::get('misc', 'tiny_mce_enabled'),
                'api_key' => Settings::get('misc', 'tiny_mce_api_key'),
                'src'     => Settings::get('misc', 'tiny_mce_src'),
            ),
            'enforce_private_admin' => Settings::get('dashboard', 'enforce_private_admin'),
            'enforce_private_front' => Settings::get('dashboard', 'enforce_private_front'),
            'ajax_nonce'            => Settings::get('misc', 'ajax_nonce'),
        );

        $constants = apply_filters('stec_js_constants', $constants);

        printf('<script type="text/javascript">const STEC_VARIABLES = %s;</script>', wp_json_encode($constants));
    }

    public function register_dep_script_hooks() {

        global $wp_scripts;

        \Automattic\Jetpack\Assets::wp_default_scripts_hook($wp_scripts);

        wp_register_script(
            'moment-tz',
            STEC_LITE_PLUGIN_URL . 'assets/js/libs/moment-tz.js',
            array('moment'),
            STEC_LITE_PLUGIN_VERSION,
            true
        );

        if (!wp_style_is('font-awesome', 'registered')) {
            wp_register_style(
                'font-awesome',
                STEC_LITE_PLUGIN_URL . 'includes/libs/fontawesome-free-6.5.1-web/css/all.min.css',
                array(),
                STEC_LITE_PLUGIN_VERSION
            );
        }
    }

    public function load_font_awesome() {

        if ($this->has_calendar_entries() && Settings::get('misc', 'font_awesome')) {
            wp_enqueue_style('font-awesome');
        }
    }

    function add_script_attributes($tag, $handle) {
        return $tag;
    }

    function add_style_attributes($tag, $handle, $href, $media) {

        if ($handle === 'font-awesome') {
            return sprintf('<link rel="preload" href="%s" as="style" onload="this.rel=\'stylesheet\';" media="%s">', $href, $media);
        }

        return $tag;
    }
}

Stachethemes_Event_Calendar::get_instance();

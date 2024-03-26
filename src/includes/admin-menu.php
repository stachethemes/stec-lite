<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Admin_Menu {

    private static $capability = 'stec_access_dashboard';

    public static function init() {

        if (is_admin()) {
            add_action('admin_menu', array(__CLASS__, 'register_admin_menu'));
            add_action('admin_enqueue_scripts', array(__CLASS__, 'enqueue_admin_scripts'));
            add_action('admin_footer', array(__CLASS__, 'add_dashboard_instance'));
        }
    }

    private static function is_dashboard_screen() {
        $screen = get_current_screen();
        return $screen->id === 'stec-lite_page_stec_dashboard';
    }

    public static function register_admin_menu() {

        global $submenu;

        add_menu_page(
            'STEC Lite',
            'STEC Lite',
            apply_filters('stec_admin_menu_capability', self::$capability),
            'stec_lite',
            '',
            plugins_url('assets/images/dashicon.png', STEC_LITE_PLUGIN_FILE),
            apply_filters('stec_admin_menu_position', null)
        );

        add_submenu_page(
            'stec_lite',
            esc_html__('Dashboard', 'stachethemes_event_calendar_lite'),
            esc_html__('Dashboard', 'stachethemes_event_calendar_lite'),
            apply_filters('stec_admin_menu_capability', self::$capability),
            'stec_dashboard',
            array(__CLASS__, 'render')
        );

        add_submenu_page(
            'stec_lite',
            esc_html__('Settings', 'stachethemes_event_calendar_lite'),
            esc_html__('Settings', 'stachethemes_event_calendar_lite'),
            'manage_stec_settings',
            admin_url('admin.php?page=stec_dashboard#settings')
        );

        add_submenu_page(
            'stec_lite',
            esc_html__('Calendars', 'stachethemes_event_calendar_lite'),
            esc_html__('Calendars', 'stachethemes_event_calendar_lite'),
            'manage_stec_cal',
            admin_url('admin.php?page=stec_dashboard#calendars-list')
        );

        add_submenu_page(
            'stec_lite',
            esc_html__('Events', 'stachethemes_event_calendar_lite'),
            esc_html__('Events', 'stachethemes_event_calendar_lite'),
            'manage_stec_event',
            admin_url('admin.php?page=stec_dashboard#events-list'),
        );

        add_submenu_page(
            'stec_lite',
            esc_html__('Categories', 'stachethemes_event_calendar_lite'),
            esc_html__('Categories', 'stachethemes_event_calendar_lite'),
            'manage_stec_cat',
            admin_url('admin.php?page=stec_dashboard#categories-list'),
        );


        add_submenu_page(
            'stec_lite',
            esc_html__('Organizers', 'stachethemes_event_calendar_lite'),
            esc_html__('Organizers', 'stachethemes_event_calendar_lite'),
            'manage_stec_org',
            admin_url('admin.php?page=stec_dashboard#organizers-list'),
        );

        add_submenu_page(
            'stec_lite',
            esc_html__('Guests', 'stachethemes_event_calendar_lite'),
            esc_html__('Guests', 'stachethemes_event_calendar_lite'),
            'manage_stec_gst',
            admin_url('admin.php?page=stec_dashboard#guests-list'),
        );

        add_submenu_page(
            'stec_lite',
            esc_html__('Locations', 'stachethemes_event_calendar_lite'),
            esc_html__('Locations', 'stachethemes_event_calendar_lite'),
            'manage_stec_loc',
            admin_url('admin.php?page=stec_dashboard#locations-list'),
        );

        add_submenu_page(
            'stec_lite',
            esc_html__('Upgrade', 'stachethemes_event_calendar_lite'),
            sprintf('<span id="stec-upgrade-menu-item" style="color: #34a853">%s</span>', esc_html__('Upgrade', 'stachethemes_event_calendar_lite')),
            apply_filters('stec_admin_menu_capability', self::$capability),
            esc_url('https://codecanyon.net/item/stachethemes-event-calendar-wordpress-events-calendar-plugin/16168229?ref=Stachethemes'),
        );

        unset($submenu['stec_lite'][0]);
    }

    public static function enqueue_admin_scripts() {

        if (self::is_dashboard_screen()) {
            wp_enqueue_media();
            wp_enqueue_script('stec-admin-dashboard-js');
            wp_set_script_translations('stec-admin-dashboard-js', 'stachethemes_event_calendar_lite', STEC_LITE_PLUGIN_ABS_PATH . 'languages');
        }
    }

    public static function render() {
        echo ('<div class="wrap"><h1 style="display: none"></h1><div id="stec-admin-dashboard"></div></div>');
    }

    public static function add_dashboard_instance() {

        if (self::is_dashboard_screen()) {

            $instance = array(
                'id' => 'stec-admin-dashboard'
            );

            printf(
                '<script type="text/javascript">%s</script>',
                sprintf('window.stecDashboardInstances = window.stecDashboardInstances || []; window.stecDashboardInstances.push(%s);', wp_json_encode($instance))
            );
        }
    }
}

Admin_Menu::init();

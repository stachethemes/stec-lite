<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * Helper class for database updates
 * when plugin version changes
 * @since 5.1.3
 */
class Db_Updater {

    // Note: make sure to return true on success and false on failure
    public static $available_updates = array(
        '5.1.3' => 'update_513',
        '5.1.4' => 'update_514',
        '5.1.5' => 'update_515'
    );

    private static function set_update_is_running() {
        update_option('stec_db_update_is_running', true);
    }

    private static function set_update_is_not_running() {
        update_option('stec_db_update_is_running', false);
    }

    public static function get_install_version() {
        $stec    = Stachethemes_Event_Calendar::get_instance();
        $version = $stec->version;
        return $version;
    }

    public static function get_db_version() {
        return get_option('stec_db_ver', '5.0.0');
    }

    public static function init() {

        if (get_option('stec_db_update_is_running', false)) {
            return;
        }

        $install_version = self::get_install_version();
        $db_version      = self::get_db_version();

        if (version_compare($db_version, '5.0.0', '<')) {
            return;
        }

        if (version_compare($db_version, $install_version, '>=')) {
            return;
        }

        /**
         * Run updates
         */

        $success = true;

        self::set_update_is_running();

        foreach (self::$available_updates as $available_update_version => $update_method) {

            if (version_compare($db_version, $available_update_version, '<')) {

                $result = call_user_func(array(__CLASS__, $update_method));

                if (!$result) {
                    Tools::log('Database update failed: ' . $update_method);
                    $success = false;
                    break;
                }

                sleep(1);
            }
        }

        self::set_update_is_not_running();

        if (!$success) {

            add_action('admin_notices', function () use ($install_version) {
                printf(
                    '<div class="notice notice-error is-dismissible"><p>%s</p></div>',
                    esc_html__('Stachethemes Event Calendar database update failed.', 'stachethemes_event_calendar_lite')
                );
            });

            return;
        }

        update_option('stec_db_ver', $install_version);

        add_action('admin_notices', function () use ($install_version) {
            printf('<div class="notice notice-success is-dismissible"><p>%s</p></div>', sprintf(
                // translators: %s: version number
                esc_html__('Stachethemes Event Calendar database is up to date. Current version: %s', 'stachethemes_event_calendar_lite'),
                esc_attr($install_version)
            ));
        });
    }

    /**
     * Changes: 
     * Added start_date_utc and end_date_utc to the events meta
     * This method will update all events meta with the new fields
     */
    public static function update_513() {

        $events_ids = get_posts(array(
            'post_type'      => 'stec_event',
            'posts_per_page' => -1,
            'post_status'    => 'any',
            'fields'         => 'ids'
        ));

        foreach ($events_ids as $id) {

            if (get_post_meta($id, 'start_date_utc', true)) {
                continue;
            }

            $start_date = get_post_meta($id, 'start_date', true);
            $end_date   = get_post_meta($id, 'end_date', true);
            $timezone   = Helpers::get_event_timezone($id);

            $start_date_utc = Helpers::get_datetime_utc($start_date, $timezone);
            $end_date_utc   = Helpers::get_datetime_utc($end_date, $timezone);

            update_post_meta($id, 'start_date_utc', $start_date_utc);
            update_post_meta($id, 'end_date_utc', $end_date_utc);
        }

        return true;
    }

    /**
     * Settings calendar__layouts changed from array to string
     */
    public static function update_514() {

        $settings = get_option('stec_settings', array());

        if (!isset($settings['calendar']) || !isset($settings['calendar']['layouts'])) {
            return true;
        }

        $value = $settings['calendar']['layouts'];

        if (is_array($value)) {
            $value = implode(',', $value);
        }

        $settings['calendar']['layouts'] = $value;

        update_option('stec_settings', $settings);

        return true;

    }

    /**
     * Add interval meta to cron job events
     * default: 1h
     */
    public static function update_515() {

        $ids = get_posts(array(
            'fields'           => 'ids',
            'posts_per_page'   => -1,
            'post_type'        => 'stec_cron_event'
        ));

        foreach($ids as $id) {
            
            $has_value = get_post_meta($id, 'interval', true);

            if ($has_value) {
                continue;
            }

            update_post_meta($id, 'interval', '1h');
        }

        return true;

    }

}

add_action('init', function () {
    Db_Updater::init();
});


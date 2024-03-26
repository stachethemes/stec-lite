<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Settings {

    private static $namespace = 'stec/v5';

    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_rest_routes'));
    }

    public static function register_rest_routes() {

        register_rest_route(self::$namespace, '/settings', array(
            'methods'             => \WP_REST_Server::READABLE,
            'callback'            => function (\WP_REST_Request $request) {

                $settings   = self::get_all();
                $result     = rest_ensure_response($settings);

                $result->set_status(200);

                return $result;
            },
            'permission_callback' => function () {
                return current_user_can('manage_stec_settings');
            },
        ));

        register_rest_route(self::$namespace, '/settings', array(
            'methods'             => \WP_REST_Server::DELETABLE,
            'callback'            => function (\WP_REST_Request $request) {

                $section = $request->get_param('section');

                switch ($section) {

                        // Reset all
                    case '': {

                            $defaults        = self::get_defaults();

                            $master_settings = self::save($defaults);
                            $result          = rest_ensure_response($master_settings);

                            $result->set_status(200);

                            return $result;

                            break;
                        }

                        // Reset by $section 
                    default: {

                            $all       = self::get_all();
                            $defaults = self::get_defaults();

                            if (!isset($all[$section]) || !isset($defaults[$section])) {
                                $result = rest_ensure_response($all);
                                $result->set_status(200);

                                return $result;
                            }

                            $all[$section] = $defaults[$section];

                            $master_settings = self::save($all);

                            $result = rest_ensure_response($master_settings);

                            $result->set_status(200);

                            return $result;

                            break;
                        }
                }
            },

            'permission_callback' => function () {
                return current_user_can('manage_stec_settings');
            },
        ));

        register_rest_route(self::$namespace, '/settings', array(
            'methods'             => \WP_REST_Server::EDITABLE,
            'callback'            => function (\WP_REST_Request $request) {

                $defaults       = self::get_defaults();
                $user_settings  = $request->get_param('settings');
                $store_settings = array_merge(
                    $defaults,
                    $user_settings
                );

                $settings   = self::save($store_settings);
                $result     = rest_ensure_response($settings);

                $result->set_status(200);

                return $result;
            },
            'permission_callback' => function () {
                return current_user_can('manage_stec_settings');
            },
        ));
    }

    public static function get_defaults() {

        return apply_filters('stec_default_settings', array(

            'calendar' => array(
                'dow'                    => 0,
                'date_format'            => 'stec_mdy',
                'time_format'            => 'stec_24',
                'show_tz_offset'         => true,
                'use_user_timezone'      => true,
                'top_enabled'            => true,
                'top_today_button'       => true,
                'top_nav_buttons'        => true,
                'top_datepicker_menu'    => true,
                'top_search_menu'        => true,
                'top_filters_menu'       => 1, /* 0 = disabled, 1 = dropdown, 2 = static */
                'top_layouts_menu'       => true,
                'top_inline_categories'  => false,
                'layouts'                => 'agenda,month,week,day,grid,boxgrid',
                'layout'                 => 'agenda',
                'ep_toggle_button'       => true,
                'scroll_to_event'        => true,
                'open_events_in'         => 'calendar',
                'links_target'           => '_self',
                'thumbnail_source'       => 'event',
                'hide_emails'            => false
            ),

            'layouts' => array(
                'agenda_list_reverse_order'   => false,
                'agenda_list_next_button'     => true,
                'agenda_list'                 => true,
                'agenda_list_limit'           => 3,
                'agenda_slider'               => true,
                'grid_counter'                => true,
                'grid_reverse_order'          => false,
                'grid_gutter'                 => 10,
                'grid_columns'                => 3,
                'grid_limit'                  => 3,
                'grid_next_button'            => true,
                'boxgrid_reverse_order'       => false,
                'boxgrid_gutter'              => 0,
                'boxgrid_columns'             => 3,
                'boxgrid_limit'               => 3,
                'boxgrid_next_button'         => true,
                'month_week_tooltip'          => true,
                'month_week_counter'          => true,
                'month_week_short_desc'       => true,
                'month_week_force_title'      => false,
                'month_week_style'            => 'fixed',
                'month_week_quick_open'       => true,
                'map_zoom'                    => 10
            ),

            'map' => array(
                'type'         => 'osm',
                'gmap_api_key' => '',
            ),

            'comments' => array(
                'type'          => 'internal',
                'fb_app_id'     => '',
            ),

            'fac' => array(
                // fonts
                'font-general'                 => 'Arial, Helvetica, sans-serif',

                // top menu
                'top-menu-bg'                  => '#fff',
                'top-menu-color'               => '#525252',
                'top-menu-color-active'        => '#fff',
                'top-menu-bg-active-primary'   => '#ff5f5f',
                'top-menu-bg-active-secondary' => '#eb4b4b',

                // agenda
                'agenda-list-title-color'      => '#454850',
                'agenda-month-year-bg'         => '#ececec',
                'agenda-month-year-color'      => '#454850',
                'agenda-cell-bg'               => '#fff',
                'agenda-cell-color'            => '#454850',
                'agenda-cell-bg-hover'         => '#ececec',
                'agenda-cell-color-hover'      => '#454850',
                'agenda-cell-bg-active'        => '#454850',
                'agenda-cell-color-active'     => '#fff',
                'agenda-cell-today-bg'         => '#fff',
                'agenda-cell-today-color'      => '#ff5f5f',

                // month and week
                'mw-legend-bg'          => '#454850',
                'mw-legend-color'       => '#bdc0c8',
                'mw-legend-today-bg'    => '#2c2e32',
                'mw-legend-today-color' => '#f6bf64',

                'mw-cell-bg'            => '#fff',
                'mw-cell-color'         => '#454850',
                'mw-cell-bg-hover'      => '#ececec',
                'mw-cell-color-hover'   => '#454850',
                'mw-cell-bg-active'     => '#454850',
                'mw-cell-color-active'  => '#fff',
                'mw-cell-diff-bg'       => '#f5f5f5',
                'mw-cell-diff-color'    => '#454850',
                'mw-cell-today-bg'      => '#ff5f5f',
                'mw-cell-today-color'   => '#fff',

                // grid
                'grid-bg'             => '#fff',
                'grid-border-color'   => '#efefef',
                'grid-title-color'    => '#454850',
                'grid-text-color'     => '#525252',

                // boxgrid
                'boxgrid-title-color'    => '#fff',
                'boxgrid-text-color'     => '#fff',
                'boxgrid-dimness'        => 0.5,
                'boxgrid-dimness-hover'  => 0.7,

                // event preview
                'ep-bg'                 => '#fff',
                'ep-bg-hover'           => '#ececec',
                'ep-title-color'        => '#454850',
                'ep-title-color-hover'  => '#525252',
                'ep-text-color'         => '#525252',
                'ep-text-color-hover'   => '#525252',
                'ep-button-color'       => '#454850',
                'ep-button-color-hover' => '#ff5f5f',

                // event content
                'ec-bg'                            => '#fff',
                'ec-title-color'                   => '#454850',
                'ec-title-secondary-color'         => '#454850',
                'ec-text-color'                    => '#525252',

                'ec-tab-menu-bg'                   => '#ececec',
                'ec-tab-menu-bg-active'            => '#fff',
                'ec-tab-menu-color'                => '#525252',
                'ec-tab-menu-color-active'         => '#525252',

                'ec-button-bg'                     => '#454850',
                'ec-button-bg-hover'               => '#ff5f5f',
                'ec-button-color'                  => '#fff',
                'ec-button-color-hover'            => '#fff',
                'ec-button-toggle-color'           => '#454850',
                'ec-button-toggle-color-hover'     => '#ff5f5f',

            ), // fonts and colors

            'dashboard' => array(
                'access'                 => array('stec_logged_in'),
                'manage_settings'        => array('administrator'),

                'manage_stec_cal'        => array('administrator'),
                'manage_stec_cat'        => array('administrator'),
                'manage_stec_loc'        => array('administrator'),
                'manage_stec_org'        => array('administrator'),
                'manage_stec_gst'        => array('administrator'),

                'manage_events'          => array('administrator'),
                'in_calendar'            => true,
                'wpmedia'                => false,
                'enforce_private_admin'  => false,
                'enforce_private_front'  => false
            ),

            'lang' => array(
                'i18n_translate_all'       => false,
                'i18n_loader'              => false,
            ),

            'pages' => array(

                'events_page_slug'         => 'stec_event'

            ),

            'misc' => array(
                'keep_data'                         => true,
                'events_per_request'                => 100,
                'events_prefetch'                   => false,
                'tiny_mce_enabled'                  => true,
                'tiny_mce_api_key'                  => '',
                'tiny_mce_src'                      => '',
                'font_awesome'                      => true,
                'force_load_enabled'                => false,
                'force_stec_scripts'                => '',
                'force_stec_events_slider_scripts'  => '',
                'force_stec_events_list_scripts'    => '',
                'ajax_nonce'                        => false
            )
        ));
    }

    public static function save($settings) {

        $settings = apply_filters('stec_before_settings_save', $settings);

        update_option('stec_settings', $settings, false);

        return self::get_all();
    }

    public static function get_all() {

        $settings                 = get_option('stec_settings', array());
        $defaults                 = self::get_defaults();
        $master_settings          = Helpers::wp_parse_args($settings, $defaults);

        return $master_settings;
    }

    public static function get($section, $setting = null, $default = null) {

        $all = self::get_all();

        if (false === isset($all[$section])) {
            return $default;
        }

        if (null !== $setting) {

            if (false === isset($all[$section][$setting])) {
                return $default;
            }

            return $all[$section][$setting];
        }

        return $all[$section];
    }

    public static function get_front_settings($sections) {

        $exclude = array(
            'dashboard__access',
            'dashboard__manage_settings',
            'dashboard__manage_stec_cal',
            'dashboard__manage_stec_cat',
            'dashboard__manage_stec_loc',
            'dashboard__manage_stec_org',
            'dashboard__manage_stec_gst',
            'dashboard__manage_events',
            'dashboard__enforce_private_admin',
            'dashboard__enforce_private_front',
            'misc__keep_data',
            'misc__tiny_mce_enabled',
            'misc__tiny_mce_api_key',
            'misc__ai_api_key',
            'misc__ai_org_id',
            'misc__ai_max_tokens',
            'misc__ai_model',
            'misc__force_load_enabled',
            'misc__force_stec_scripts',
            'misc__force_stec_events_slider_scripts',
            'misc__force_stec_events_list_scripts'
        );

        $safe_return = array();
        $all = self::get_all();

        foreach ($all as $section => $values) {

            if (false === in_array($section, $sections)) {
                continue;
            }

            foreach ($values as $setting => $value) {

                $value = is_array($value) ? implode(',', $value) : $value;

                $keyValue = $section . '__' . $setting;

                if (false === in_array($keyValue, $exclude)) {
                    $safe_return[$keyValue] = $value;
                }
            }
        }

        return $safe_return;
    }

    public static function get_general_css() {

        $CSS = self::get('fac');

        if (array_key_exists('custom-style', $CSS)) {
            $CUSTOM_STYLE = $CSS['custom-style'];
            unset($CSS['custom-style']);
        } else {
            $CUSTOM_STYLE = '';
        }

        $CSS_ARRAY = array();

        $CSS_ARRAY[] = ':root {';

        foreach ($CSS as $var => $value) {
            $CSS_ARRAY[] = sprintf('--stec-%s:%s;', $var, $value);
        }

        $CSS_ARRAY[] = '}';

        if ($CUSTOM_STYLE) {
            $CSS_ARRAY[] = $CUSTOM_STYLE;
        }

        $CSS_ARRAY_CONTENT = implode('', $CSS_ARRAY);

        return $CSS_ARRAY_CONTENT;
    }
}

Settings::init();

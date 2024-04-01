<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * Events List Widget
 */
class Widget_Events_List {

    public static function init() {

        add_action('init', array(__CLASS__, 'register_scripts'));
        add_action('init', array(__CLASS__, 'register_block_types'));
    }

    public static function register_scripts() {

        wp_register_script(
            'stec-widget-admin-events-list',
            STEC_LITE_PLUGIN_URL . 'assets/js/widgets/events-list/admin.js',
            array('wp-blocks', 'wp-element', 'wp-i18n', 'wp-jp-i18n-loader', 'lodash'),
            STEC_LITE_PLUGIN_VERSION,
            array(
                'in_footer' => true,
                'strategy'  => 'defer'
            )
        );

        wp_register_style(
            'stec-widget-admin-events-list-style',
            STEC_LITE_PLUGIN_URL . 'assets/css/widgets/events-list/admin.css',
            array(),
            STEC_LITE_PLUGIN_VERSION
        );

    }

    public static function register_widget_instance($name, $atts) {

        add_action('wp_footer', function () use ($name, $atts) {
            echo '<script type="text/javascript">';
            printf('if (typeof window.%1$sInstances === "undefined") { window.%1$sInstances = []; }', esc_attr($name));
            printf('window.%sInstances.push(%s);', esc_attr($name), wp_json_encode($atts));
            echo '</script>';
        });
    }

    public static function register_block_types() {

        register_block_type('stec/widget-events-list', array(
            'api_version'     => 2,
            'textdomain'      => 'stachethemes_event_calendar_lite',
            'title'           => esc_html__('Events List', 'stachethemes_event_calendar_lite'),
            'editor_script'   => 'stec-widget-admin-events-list',
            'editor_style'    => 'stec-widget-admin-events-list-style',
            'render_callback' => function ($attributes, $content) {

                $map_attribs = array_map(function ($key, $value) {

                    if ($key === 'extra') {
                        return $value;
                    }

                    if (is_array($value)) {
                        $value = implode(',', $value);
                    }

                    return "{$key}=\"{$value}\"";
                }, array_keys($attributes), $attributes);

                $shortcode_atts = implode(' ', $map_attribs);

                return do_shortcode(sprintf('[stec_events_list %s]', $shortcode_atts));
            }
        ));

        add_action('enqueue_block_assets', function () {

            if (has_block('stec/widget-events-list')) {
                wp_enqueue_script('stec-widget-events-list');
                wp_set_script_translations('stec-widget-events-list', 'stachethemes_event_calendar_lite', STEC_LITE_PLUGIN_ABS_PATH . 'languages');
            }
        });

    }


}

Widget_Events_List::init();

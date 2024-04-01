<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * Calendar block widget
 */
class Widget_Stec {

    public static function init() {

        add_action('init', array(__CLASS__, 'register_scripts'));
        add_action('init', array(__CLASS__, 'register_block_types'));
        add_action('block_categories_all', array(__CLASS__, 'register_stachethemes_category'), 10, 2);
    }

    public static function register_stachethemes_category($categories, $block_editor_context) {

        return array_merge(

            $categories,
            [
                [
                    'slug'  => 'stachethemes',
                    'title' => 'Stachethemes',
                ],
            ]
        );
    }

    public static function register_scripts() {

        wp_register_script(
            'stec-widget-admin-stec',
            STEC_LITE_PLUGIN_URL . 'assets/js/widgets/stec/admin.js',
            array('wp-blocks', 'wp-element', 'wp-i18n', 'wp-jp-i18n-loader', 'lodash'),
            STEC_LITE_PLUGIN_VERSION,
            array(
                'in_footer' => true,
                'strategy'  => 'defer'
            )
        );

        wp_register_style(
            'stec-widget-admin-stec-style',
            STEC_LITE_PLUGIN_URL . 'assets/css/widgets/stec/admin.css',
            array(),
            STEC_LITE_PLUGIN_VERSION
        );
    }

    public static function register_block_types() {

        register_block_type('stec/widget-stec', array(
            'api_version'     => 2,
            'textdomain'      => 'stachethemes_event_calendar_lite',
            'title'           => esc_html__('Full Calendar', 'stachethemes_event_calendar_lite'),
            'editor_script'   => 'stec-widget-admin-stec',
            'editor_style'    => 'stec-widget-admin-stec-style',
            'render_callback' => function ($attributes, $content) {

                if (isset($attributes['filter__min_date_custom']) && $attributes['filter__min_date_custom']) {
                    $attributes['filter__min_date'] = $attributes['filter__min_date_custom'];
                    unset($attributes['filter__min_date_custom']);
                }

                if (isset($attributes['filter__max_date_custom']) && $attributes['filter__max_date_custom']) {
                    $attributes['filter__max_date'] = $attributes['filter__max_date_custom'];
                    unset($attributes['filter__max_date_custom']);
                }

                $map_attribs = array_map(function ($key, $value) {

                    if ($key === 'extra') {
                        return $value;
                    }

                    if (is_array($value)) {
                        $value = implode(',', $value);
                    }

                    return "{$key}=\"{$value}\"";
                }, array_keys($attributes), $attributes);

                $shortcode_attribs = implode(' ', $map_attribs);

                return do_shortcode(sprintf('[stec %s]', $shortcode_attribs));
            },
        ));

        add_action('enqueue_block_assets', function () {

            if (has_block('stec/widget-stec')) {
                wp_enqueue_script('stec-init-js');
                wp_set_script_translations('stec-init-js', 'stachethemes_event_calendar_lite', STEC_LITE_PLUGIN_ABS_PATH . 'languages');
            }
        });

    }
}

Widget_Stec::init();

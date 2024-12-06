<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

trait Shortcode_Force_Load {

    public static function scripts_are_forced($shortcode) {

        global $post;

        if (true === apply_filters('stec_force_load_' . $shortcode . '_scripts', false, $post)) {
            return true;
        }

        $post_id = is_a($post, 'WP_Post') ? $post->ID : 0;

        if (!$post_id) {
            return false;
        }

        $force_load_enabled = Settings::get('misc', 'force_load_enabled', false);
        $force_load         = Settings::get('misc', 'force_' . $shortcode . '_scripts', '');
        $force_load_ids     = explode(',', $force_load);

        if (!$force_load_enabled) {
            return false;
        }

        return in_array($post_id, $force_load_ids);
    }

    // If the scripts aren't enqueued at this point then it appears the shortcode is not detected
    // so we load the scripts in the footer
    public static function check_late_scripts_load($shortcode_hook) {

        $late_load_detected = false;

        if (!wp_script_is($shortcode_hook, 'enqueued')) {
            wp_enqueue_script($shortcode_hook);
            $late_load_detected = true;
        }

        if (Settings::get('misc', 'font_awesome') && !wp_style_is('font-awesome', 'enqueued')) {
            $late_load_detected = true;
            wp_enqueue_style('font-awesome');
        }

        if (!wp_style_is('stec-css-dependencies', 'enqueued')) {
            $late_load_detected = true;
            wp_enqueue_style('stec-css-dependencies');
        }

        if ($late_load_detected) {
            ?>
            <script>
                console.warn('STEC: Shortcode not detected, scripts loaded in the footer');
            </script>
            <?php
        }
    }
}

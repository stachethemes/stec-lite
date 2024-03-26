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
}

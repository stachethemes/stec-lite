<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

trait Shortcode_Helpers {

    public static function has_shortcode($shortcode) {

        global $post;

        if (
            is_a($post, 'WP_Post')
            && (has_shortcode($post->post_content, $shortcode))
        ) {
            return true;
        }

        return false;
    }
}

<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Tools {

    private static function _safe($value) {
        return $value;
    }

    public static function log($msg) {

        $PRETEXT = 'STEC LOG:: ';
        $log = '';

        if (is_object($msg) || is_array($msg)) {

            ob_start();

            print_r(self::_safe($msg));

            $log = ob_get_clean();
        } else {
            $log = $msg;
        }

        error_log($PRETEXT . $log);
    }

    public static function delete_all_events() {

        $ids = get_posts(array(
            'fields'     => 'ids',
            'posts_per_page'   => -1,
            'post_type'  => 'stec_event'
        ));

        if (is_array($ids)) {
            foreach ($ids as $id) {
                wp_delete_post($id, true);
            }
        }
    }

    public static function delete_all_from_taxonomies() {

        $allowed_taxonomies = array('stec_cal', 'stec_cat', 'stec_gst', 'stec_org', 'stec_loc');

        foreach ($allowed_taxonomies as $taxonomy_name) {
            self::delete_all_from_taxonomy($taxonomy_name);
        }
    }

    public static function delete_all_from_taxonomy($taxonomy_name = '') {

        $allowed_taxonomies = array('stec_cal', 'stec_cat', 'stec_gst', 'stec_org', 'stec_loc');

        if (false === in_array($taxonomy_name, $allowed_taxonomies)) {
            throw new Stec_Exception(esc_html__('Only calendar taxonomies are allowed', 'stachethemes_event_calendar_lite'));
        }

        $terms = get_terms(array(
            'taxonomy'   => $taxonomy_name,
            'hide_empty' => false,
        ));

        if (is_array($terms)) {
            foreach ($terms as $term) {

                wp_delete_term($term->term_id, $taxonomy_name);
            }
        }
    }

    public static function delete_settings() {
        delete_option('stec_settings');
    }
}

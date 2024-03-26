<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * * Uninstall hook
 */
register_uninstall_hook(STEC_LITE_PLUGIN_FILE, '\Stachethemes\Steclite\stec_on_uninstall');

function stec_on_uninstall() {

    global $wpdb;

    if (function_exists('is_multisite') && is_multisite()) {

        $old_blog = $wpdb->blogid;

        // Get all blog ids
        $blogids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");

        foreach ($blogids as $blog_id) {
            switch_to_blog($blog_id);
            stec_on_uninstall_tables_and_settings();
        }

        switch_to_blog($old_blog);
        return;
    }

    stec_on_uninstall_tables_and_settings();
}

function stec_on_uninstall_tables_and_settings() {

    if (Settings::get('misc', 'keep_data')) {
        return;
    }

    global $wpdb;

    // Delete plugin custom post types
    $delete_cpt_array = array('stec_event');

    foreach ($delete_cpt_array as $post_type) {

        if (false === post_type_exists($post_type)) {
            continue;
        }

        $wpdb->query($wpdb->prepare("DELETE `POSTS`, `META` 
        FROM {$wpdb->prefix}posts as POSTS
        LEFT JOIN {$wpdb->prefix}postmeta AS META 
        ON META.post_id = POSTS.ID
        WHERE POSTS.post_type = %s ", $post_type));
    }

    // Delete plugin taxonomies
    $taxonomy_arr = array('stec_cal', 'stec_loc', 'stec_cat', 'stec_gst', 'stec_org');

    foreach ($taxonomy_arr as $taxonomy) {

        if (false === taxonomy_exists($taxonomy)) {
            continue;
        }


        $terms = $wpdb->get_results($wpdb->prepare("SELECT t.*, tt.* FROM $wpdb->terms AS t "
            . "INNER JOIN $wpdb->term_taxonomy AS tt ON t.term_id = tt.term_id "
            . "WHERE tt.taxonomy IN ( %s ) "
            . "ORDER BY t.name ASC", $taxonomy));

        // Delete Terms
        if ($terms) {
            foreach ($terms as $term) {
                $wpdb->delete($wpdb->term_taxonomy, array('term_taxonomy_id' => $term->term_taxonomy_id));
                $wpdb->delete($wpdb->terms, array('term_id' => $term->term_id));
                delete_option('prefix_' . $term->slug . '_option_name');
            }
        }

        // Delete Taxonomy
        $wpdb->delete($wpdb->term_taxonomy, array('taxonomy' => $taxonomy), array('%s'));
    }

    // Delete plugin settings
    delete_option('stec_settings');
}

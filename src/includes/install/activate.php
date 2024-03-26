<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * * Activation Hook 
 */
register_activation_hook(STEC_LITE_PLUGIN_FILE, '\Stachethemes\Steclite\stec_on_activate');

function stec_on_activate($networkwide) {

    global $wpdb;

    if (function_exists('is_multisite') && is_multisite()) {

        // check if it is a network activation - if so, run the activation function for each blog id

        if ($networkwide) {

            $old_blog = $wpdb->blogid;

            // Get all blog ids
            $blogids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");

            foreach ($blogids as $blog_id) {
                switch_to_blog($blog_id);
                stec_on_activate_tables_and_settings();
            }

            switch_to_blog($old_blog);

            return;
        }
    }

    stec_on_activate_tables_and_settings();
}

function stec_on_activate_tables_and_settings() {

}
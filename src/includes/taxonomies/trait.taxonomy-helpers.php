<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * This trait includes labels that may or may not be used somewhere in WordPress
 * and includes the capabilities filter
 */
trait Taxonomy_Trait_Helpers {

    public static function get_taxonomy_labels($single, $plural) {

        return array(
            'name'                       => esc_html($plural),
            'singular_name'              => esc_html($single),
            'search_items'               => sprintf(esc_html_x('Search %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'popular_items'              => sprintf(esc_html_x('Popular %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'all_items'                  => sprintf(esc_html_x('All %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'parent_item'                => sprintf(esc_html_x('Parent %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'parent_item_colon'          => sprintf(esc_html_x('Parent %s:', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'edit_item'                  => sprintf(esc_html_x('Edit %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'view_item'                  => sprintf(esc_html_x('View %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'update_item'                => sprintf(esc_html_x('Update %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'add_new_item'               => sprintf(esc_html_x('Add new %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'new_item_name'              => sprintf(esc_html_x('New %s name', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'separate_items_with_commas' => sprintf(esc_html_x('Separate %s with commas', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'add_or_remove_items'        => sprintf(esc_html_x('Add or remove %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'choose_from_most_used'      => sprintf(esc_html_x('Choose most used %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'not_found'                  => sprintf(esc_html_x('No %s found', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'no_terms'                   => sprintf(esc_html_x('No %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'filter_by_item'             => sprintf(esc_html_x('Filter by %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'items_list_navigation'      => sprintf(esc_html_x('%s list navigation', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'items_list'                 => sprintf(esc_html_x('%s list', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'most_used'                  => sprintf(esc_html_x('Most used %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'back_to_items'              => sprintf(esc_html_x('&larr; Go to %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
        );
    }

    public static function get_taxonomy_capabilities($taxonomy) {

        /**
         * These are the global taxonomy capabilities 
         * READ / EDIT / DELETE REST routes should check 
         * if these conditions are met first
         */

        return array(
            'manage_terms' => 'manage_' . $taxonomy,
            'edit_terms'   => 'manage_' . $taxonomy,
            'delete_terms' => 'manage_' . $taxonomy,
            'assign_terms' => 'assign_' . $taxonomy,
        );
    }
}

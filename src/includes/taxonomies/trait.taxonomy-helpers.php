<?php

namespace Stachethemes\Steclite;

/**
 * This trait includes labels that may or may not be used somewhere in WordPress
 * and includes the capabilities filter
 */
trait Taxonomy_Trait_Helpers {

    public static function get_taxonomy_labels($single, $plural) {

        return array(
            'name'                       => esc_html_x($plural, 'taxonomy general name', 'stachethemes_event_calendar_lite'),
            'singular_name'              => esc_html_x($single, 'taxonomy singular name', 'stachethemes_event_calendar_lite'),
            'search_items'               => esc_html_x(sprintf('Search %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'popular_items'              => esc_html_x(sprintf('Popular %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'all_items'                  => esc_html_x(sprintf('All %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'parent_item'                => esc_html_x(sprintf('Parent %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'parent_item_colon'          => esc_html_x(sprintf('Parent %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'edit_item'                  => esc_html_x(sprintf('Edit %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'view_item'                  => esc_html_x(sprintf('View %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'update_item'                => esc_html_x(sprintf('Update %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'add_new_item'               => esc_html_x(sprintf('Add new %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'new_item_name'              => esc_html_x(sprintf('New %s name', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'separate_items_with_commas' => esc_html_x(sprintf('Separate %s with commas', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'add_or_remove_items'        => esc_html_x(sprintf('Add or remove %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'choose_from_most_used'      => esc_html_x(sprintf('Choose most used %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'not_found'                  => esc_html_x(sprintf('No %s found', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'no_terms'                   => esc_html_x(sprintf('No %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'filter_by_item'             => esc_html_x(sprintf('Filter by %s', 'taxonomy singular name', 'stachethemes_event_calendar_lite'), $single),
            'items_list_navigation'      => esc_html_x(sprintf('%s list navigation', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'items_list'                 => esc_html_x(sprintf('%s list', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'most_used'                  => esc_html_x(sprintf('Most used %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
            'back_to_items'              => esc_html_x(sprintf('&larr; Go to %s', 'taxonomy plural name', 'stachethemes_event_calendar_lite'), $plural),
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

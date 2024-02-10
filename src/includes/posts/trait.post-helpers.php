<?php

namespace Stachethemes\Steclite;

/**
 * This trait includes labels that may or may not be used somewhere in WordPress
 * and includes the capabilities filter
 */
trait Post_Trait_Helpers {

    public static function get_post_labels($single, $plural) {

        return array(
            'name'                       => esc_html_x($plural, 'post general name', 'stachethemes_event_calendar_lite'),
            'singular_name'              => esc_html_x($single, 'post singular name', 'stachethemes_event_calendar_lite'),
            'add_new'                    => esc_html_x('Add New', 'event', 'stachethemes_event_calendar_lite'),
            'add_new_item'               => esc_html_x(sprintf('Add new %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'edit_item'                  => esc_html_x(sprintf('Edit %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'new_item'                   => esc_html_x(sprintf('New %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'view_item'                  => esc_html_x(sprintf('View %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'view_items'                 => esc_html_x(sprintf('New %s', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'search_items'               => esc_html_x(sprintf('Search %s', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'not_found'                  => esc_html_x(sprintf('No %s found', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'not_found_in_trash'         => esc_html_x(sprintf('No %s found in trash', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'parent_item_colon'          => esc_html__('Parent Page:', 'stachethemes_event_calendar_lite'),
            'all_items'                  => esc_html_x(sprintf('All %s', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'archives'                   => esc_html_x(sprintf('%s archive', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'attributes'                 => esc_html_x(sprintf('%s attributes', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'insert_into_item'           => esc_html_x(sprintf('Insert into %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'uploaded_to_this_item'      => esc_html_x(sprintf('Uploaded to this %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'featured_image'             => esc_html_x('Featured image', 'event', 'stachethemes_event_calendar_lite'),
            'set_featured_image'         => esc_html_x('Set featured image', 'event', 'stachethemes_event_calendar_lite'),
            'remove_featured_image'      => esc_html_x('Remove featured image', 'event', 'stachethemes_event_calendar_lite'),
            'use_featured_image'         => esc_html_x('Use as featured image', 'event', 'stachethemes_event_calendar_lite'),
            'filter_items_list'          => esc_html_x(sprintf('Filter %s list', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'filter_by_date'             => esc_html__('Filter by date', 'stachethemes_event_calendar_lite'),
            'items_list_navigation'      => esc_html_x(sprintf('%s list navigation', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'items_list'                 => esc_html_x(sprintf('%s list', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'item_published'             => esc_html_x(sprintf('%s published', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'item_published_privately'   => esc_html_x(sprintf('%s published privately', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'item_reverted_to_draft'     => esc_html_x(sprintf('%s reverted to draft', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'item_scheduled'             => esc_html_x(sprintf('%s scheduled', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'item_updated'               => esc_html_x(sprintf('%s scheduled', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
        );
    }

    public static function get_post_capabilities($post_type) {

        /**
         * These are the global post capabilities 
         * READ / EDIT / DELETE REST routes should check 
         * if these conditions are met first
         */
        
        return array(
            'edit_post'          => 'manage_' . $post_type,
            'edit_posts'         => 'manage_' . $post_type,
            'edit_others_posts'  => 'manage_' . $post_type,
            'publish_posts'      => 'manage_' . $post_type,
            'read_post'          => 'read_'   . $post_type,
            'read_private_posts' => 'read_'   . $post_type,
            'delete_post'        => 'manage_' . $post_type
        );
    }
}

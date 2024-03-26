<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * This trait includes labels that may or may not be used somewhere in WordPress
 * and includes the capabilities filter
 */
trait Post_Trait_Helpers {

    public static function get_post_labels($single, $plural) {

        return array(
            'name'                       => esc_html($plural),
            'singular_name'              => esc_html($single, 'post singular name', 'stachethemes_event_calendar_lite'),
            'add_new'                    => esc_html__('Add New', 'stachethemes_event_calendar_lite'),
            'add_new_item'               => sprintf(esc_html_x('Add New %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'edit_item'                  => sprintf(esc_html_x('Edit %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'new_item'                   => sprintf(esc_html_x('New %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'view_item'                  => sprintf(esc_html_x('View %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'view_items'                 => sprintf(esc_html_x('View %s', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'search_items'               => sprintf(esc_html_x('Search %s', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'not_found'                  => sprintf(esc_html_x('No %s found', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'not_found_in_trash'         => sprintf(esc_html_x('No %s found in trash', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'parent_item_colon'          => esc_html__('Parent Page:', 'stachethemes_event_calendar_lite'),
            'all_items'                  => sprintf(esc_html_x('All %s', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'archives'                   => sprintf(esc_html_x('%s archive', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'attributes'                 => sprintf(esc_html_x('%s attributes', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'insert_into_item'           => sprintf(esc_html_x('Insert into %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'uploaded_to_this_item'      => sprintf(esc_html_x('Uploaded to this %s', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'featured_image'             => esc_html__('Featured image', 'stachethemes_event_calendar_lite'),
            'set_featured_image'         => esc_html__('Set featured image', 'stachethemes_event_calendar_lite'),
            'remove_featured_image'      => esc_html__('Remove featured image', 'stachethemes_event_calendar_lite'),
            'use_featured_image'         => esc_html__('Use as featured image', 'stachethemes_event_calendar_lite'),
            'filter_items_list'          => sprintf(esc_html_x('Filter %s list', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'filter_by_date'             => esc_html__('Filter by date', 'stachethemes_event_calendar_lite'),
            'items_list_navigation'      => sprintf(esc_html_x('%s list navigation', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'items_list'                 => sprintf(esc_html_x('%s list', 'post plural name', 'stachethemes_event_calendar_lite'), $plural),
            'item_published'             => sprintf(esc_html_x('%s published', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'item_published_privately'   => sprintf(esc_html_x('%s published privately', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'item_reverted_to_draft'     => sprintf(esc_html_x('%s reverted to draft', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'item_scheduled'             => sprintf(esc_html_x('%s scheduled', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
            'item_updated'               => sprintf(esc_html_x('%s updated', 'post singular name', 'stachethemes_event_calendar_lite'), $single),
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

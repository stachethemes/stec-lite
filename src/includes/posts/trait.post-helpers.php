<?php

namespace Stachethemes\Steclite;

/**
 * This trait includes labels that may or may not be used somewhere in WordPress
 * and includes the capabilities filter
 */
trait Post_Trait_Helpers {

    public static function get_post_labels($single, $plural) {

        return array(
            'name'                       => esc_html_x($plural, 'post general name', 'stec'),
            'singular_name'              => esc_html_x($single, 'post singular name', 'stec'),
            'add_new'                    => esc_html_x('Add New', 'event', 'stec'),
            'add_new_item'               => esc_html_x(sprintf('Add new %s', 'post singular name', 'stec'), $single),
            'edit_item'                  => esc_html_x(sprintf('Edit %s', 'post singular name', 'stec'), $single),
            'new_item'                   => esc_html_x(sprintf('New %s', 'post singular name', 'stec'), $single),
            'view_item'                  => esc_html_x(sprintf('View %s', 'post singular name', 'stec'), $single),
            'view_items'                 => esc_html_x(sprintf('New %s', 'post plural name', 'stec'), $plural),
            'search_items'               => esc_html_x(sprintf('Search %s', 'post plural name', 'stec'), $plural),
            'not_found'                  => esc_html_x(sprintf('No %s found', 'post plural name', 'stec'), $plural),
            'not_found_in_trash'         => esc_html_x(sprintf('No %s found in trash', 'post plural name', 'stec'), $plural),
            'parent_item_colon'          => esc_html__('Parent Page:', 'stec'),
            'all_items'                  => esc_html_x(sprintf('All %s', 'post plural name', 'stec'), $plural),
            'archives'                   => esc_html_x(sprintf('%s archive', 'post singular name', 'stec'), $single),
            'attributes'                 => esc_html_x(sprintf('%s attributes', 'post singular name', 'stec'), $single),
            'insert_into_item'           => esc_html_x(sprintf('Insert into %s', 'post singular name', 'stec'), $single),
            'uploaded_to_this_item'      => esc_html_x(sprintf('Uploaded to this %s', 'post singular name', 'stec'), $single),
            'featured_image'             => esc_html_x('Featured image', 'event', 'stec'),
            'set_featured_image'         => esc_html_x('Set featured image', 'event', 'stec'),
            'remove_featured_image'      => esc_html_x('Remove featured image', 'event', 'stec'),
            'use_featured_image'         => esc_html_x('Use as featured image', 'event', 'stec'),
            'filter_items_list'          => esc_html_x(sprintf('Filter %s list', 'post plural name', 'stec'), $plural),
            'filter_by_date'             => esc_html__('Filter by date', 'stec'),
            'items_list_navigation'      => esc_html_x(sprintf('%s list navigation', 'post plural name', 'stec'), $plural),
            'items_list'                 => esc_html_x(sprintf('%s list', 'post plural name', 'stec'), $plural),
            'item_published'             => esc_html_x(sprintf('%s published', 'post singular name', 'stec'), $single),
            'item_published_privately'   => esc_html_x(sprintf('%s published privately', 'post singular name', 'stec'), $single),
            'item_reverted_to_draft'     => esc_html_x(sprintf('%s reverted to draft', 'post singular name', 'stec'), $single),
            'item_scheduled'             => esc_html_x(sprintf('%s scheduled', 'post singular name', 'stec'), $single),
            'item_updated'               => esc_html_x(sprintf('%s scheduled', 'post singular name', 'stec'), $single),
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

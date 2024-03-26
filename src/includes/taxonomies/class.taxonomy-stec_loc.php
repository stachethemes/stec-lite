<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Taxonomy_Stec_Loc {

    use Taxonomy_Trait_Helpers;

    protected static $taxonomy = 'stec_loc';

    public static function init() {
        add_action('init', array(__CLASS__, 'register_taxonomies'), 5);
        add_action('init', array(__CLASS__, 'register_meta'), 5);
    }

    public static function register_taxonomies() {

        register_taxonomy(
            self::$taxonomy,
            'stec_event',
            array(
                'label'                => esc_html__('Locations', 'stachethemes_event_calendar_lite'),
                'labels'               => self::get_taxonomy_labels(esc_html__('Location', 'stachethemes_event_calendar_lite'), esc_html__('Locations', 'stachethemes_event_calendar_lite')),
                'public'               => false,
                'publicly_queryable'   => false,
                'show_in_rest'         => true,
                'query_var'            => true,
                'hierarchical'         => false,
                'show_tagcloud'        => false,
                'show_ui'              => false,
                'sort'                 => false,
                'capabilities'         => self::get_taxonomy_capabilities(self::$taxonomy),
                'rest_controller_class' => '\Stachethemes\Steclite\Rest_Stec_Loc_Controller',
            )
        );
    }

    public static function register_meta() {

        register_term_meta(self::$taxonomy, 'author', array('show_in_rest' => true, 'type' => 'number', 'single' => true));
        register_term_meta(self::$taxonomy, 'color', array('show_in_rest' => true, 'type' => 'string', 'single' => true));
        register_term_meta(self::$taxonomy, 'country', array('show_in_rest' => true, 'type' => 'string', 'single' => true));
        register_term_meta(self::$taxonomy, 'state', array('show_in_rest' => true, 'type' => 'string', 'single' => true));
        register_term_meta(self::$taxonomy, 'city', array('show_in_rest' => true, 'type' => 'string', 'single' => true));
        register_term_meta(self::$taxonomy, 'address', array('show_in_rest' => true, 'type' => 'string', 'single' => true));
        register_term_meta(self::$taxonomy, 'coordinates', array('show_in_rest' => true, 'type' => 'string', 'single' => true));
        register_term_meta(self::$taxonomy, 'postal_code', array('show_in_rest' => true, 'type' => 'string', 'single' => true));
        register_term_meta(self::$taxonomy, 'type', array('show_in_rest' => true, 'type' => 'string', 'single' => true));
        register_term_meta(self::$taxonomy, 'read_permission', array('show_in_rest' => true, 'type' => 'string', 'single' => false));
        register_term_meta(self::$taxonomy, 'edit_permission', array('show_in_rest' => true, 'type' => 'string', 'single' => false));
        register_term_meta(self::$taxonomy, 'use_permission', array('show_in_rest' => true, 'type' => 'string', 'single' => false));
        register_term_meta(self::$taxonomy, 'protected', array('show_in_rest' => true, 'type' => 'boolean', 'single' => true));
    }
}

Taxonomy_Stec_Loc::init();
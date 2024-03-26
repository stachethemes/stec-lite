<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Taxonomy_Stec_Gst {

    use Taxonomy_Trait_Helpers;

    protected static $taxonomy = 'stec_gst';

    public static function init() {
        add_action('init', array(__CLASS__, 'register_taxonomies'), 5);
        add_action('init', array(__CLASS__, 'register_meta'), 5);
    }

    public static function register_taxonomies() {

        register_taxonomy(
            self::$taxonomy,
            'stec_event',
            array(
                'label'                => esc_html__('Guests', 'stachethemes_event_calendar_lite'),
                'labels'               => self::get_taxonomy_labels(esc_html__('Guest', 'stachethemes_event_calendar_lite'), esc_html__('Guests', 'stachethemes_event_calendar_lite')),
                'public'               => false,
                'publicly_queryable'   => false,
                'show_in_rest'         => true,
                'query_var'            => true,
                'hierarchical'         => false,
                'show_tagcloud'        => false,
                'show_ui'              => false,
                'sort'                 => false,
                'capabilities'         => self::get_taxonomy_capabilities(self::$taxonomy),
                'rest_controller_class' => '\Stachethemes\Steclite\Rest_Stec_Gst_Controller',
            )
        );
    }

    public static function register_meta() {

        register_term_meta(self::$taxonomy, 'author', array('show_in_rest' => true, 'type' => 'number', 'single' => true));
        register_term_meta(self::$taxonomy, 'color', array('show_in_rest' => true, 'type' => 'string', 'single' => true));
        register_term_meta(self::$taxonomy, 'read_permission', array('show_in_rest' => true, 'type' => 'string', 'single' => false));
        register_term_meta(self::$taxonomy, 'edit_permission', array('show_in_rest' => true, 'type' => 'string', 'single' => false));
        register_term_meta(self::$taxonomy, 'use_permission', array('show_in_rest' => true, 'type' => 'string', 'single' => false));

        register_term_meta(
            self::$taxonomy,
            'photo',
            array(
                'type' => 'object',
                'single' => false,
                'show_in_rest' => array(
                    'schema' => array(
                        'type' => 'object',
                        'properties' => array(
                            'id' => array(
                                'type' => 'number'
                            ),
                            'sizes' => array(
                                'type' => 'object',
                                'properties' => array(
                                    'thumbnail' => array(
                                        'type' => 'string'
                                    ),
                                    'medium' => array(
                                        'type' => 'string'
                                    ),
                                    'large' => array(
                                        'type' => 'string'
                                    ),
                                    'full' => array(
                                        'type' => 'string'
                                    )
                                )
                            )
                        )
                    )
                ),
            )
        );

        register_term_meta(self::$taxonomy, 'email',  array(
            'show_in_rest' => true,
            'type' => 'string',
            'single' => true,
            'default'  => '',
            'sanitize_callback' => function ($value) {
                if (false === filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    return '';
                }

                return $value;
            }
        ));

        register_term_meta(
            self::$taxonomy,
            'social',
            array(
                'type' => 'object',
                'single' => false,
                'show_in_rest' => array(
                    'schema' => array(
                        'type' => 'object',
                        'properties' => array(
                            'icon' => array(
                                'type' => 'string'
                            ),
                            'url' => array(
                                'type' => 'string',
                            ),
                        ),
                    )
                ),
            )
        );
    }
}

Taxonomy_Stec_Gst::init();

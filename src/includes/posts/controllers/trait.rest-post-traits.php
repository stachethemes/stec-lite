<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * Traits for stec post types
 * 
 * routes: /stec/v5/{post_type}/?{id}
 * 
 * methods POST PUT DELETE
 */
trait Rest_Post_Traits {

    public function __construct($post_type) {

        $this->post_type  = $post_type;
        $this->namespace  = 'stec/v5';
        $this->meta       = new \WP_REST_Post_Meta_Fields($this->post_type);

        add_filter("rest_{$this->post_type}_query", array($this, 'before_query'), 5, 2);
        add_filter("rest_{$this->post_type}_collection_params", array($this, 'collection_params'), 5, 2);
    }

    public function get_maybe_custom_collection_params($callback) {

        if (method_exists($this, "{$callback}_collection_params")) {
            return $this->{"{$callback}_collection_params"}();
        }

        return $this->get_collection_params();
    }

    public function register_routes() {

        register_rest_route(
            $this->namespace,
            $this->rest_base,
            array(

                array(
                    'methods'             => \WP_REST_Server::READABLE,
                    'callback'            => array($this, 'get_items'),
                    'permission_callback' => array($this, 'read_permission'),
                    'args'                => $this->get_maybe_custom_collection_params('get_items'),
                ),

                array(
                    'methods'             => \WP_REST_Server::CREATABLE,
                    'callback'            => array($this, 'create_item'),
                    'permission_callback' => array($this, 'create_permission'),
                    'args'                => $this->get_endpoint_args_for_item_schema(\WP_REST_Server::CREATABLE),
                ),

                'schema' => array($this, 'get_public_item_schema'),
            )
        );

        register_rest_route(
            $this->namespace,
            $this->rest_base . '/(?P<id>[\d]+)',
            array(
                'args'   => array(
                    'id' => array(
                        'description' => esc_html__('Unique identifier for the post.', 'stachethemes_event_calendar_lite'),
                        'type'        => 'integer',
                    ),
                ),

                array(
                    'methods'             => \WP_REST_Server::READABLE,
                    'callback'            => array($this, 'get_item'),
                    'permission_callback' => array($this, 'read_permission'),
                ),

                array(
                    'methods'             => \WP_REST_Server::EDITABLE,
                    'callback'            => array($this, 'update_item'),
                    'permission_callback' => array($this, 'edit_permission'),
                    'args'                => $this->get_endpoint_args_for_item_schema(\WP_REST_Server::EDITABLE),
                ),

                array(
                    'methods'             => \WP_REST_Server::DELETABLE,
                    'callback'            => array($this, 'delete_item'),
                    'permission_callback' => array($this, 'delete_permission'),
                    'args'                => array(
                        'force' => array(
                            'type'        => 'boolean',
                            'default'     => true,
                            'description' => esc_html__('Force delete post', 'stachethemes_event_calendar_lite'),
                        ),
                    ),
                ),

                'schema' => array($this, 'get_public_item_schema'),
            )
        );

        // Method for adding additional rest routes from the actual controller
        if (method_exists($this, 'add_rest_route')) {
            $this->add_rest_route();
        }
    }

    /**
     * Inserts permissions meta query
     */
    public function before_query($prepared_args, $request) {

        $permission_type = $request->get_param('permission_type');

        // fallback to read_permission if no permission set
        if (false === in_array($permission_type, array('read_permission', 'use_permission', 'edit_permission'))) {
            $permission_type = 'read_permission';
        }

        $prepared_args['meta_query'] = array(
            'relation' => 'AND'
        );

        // Super user can see all posts regardless of permissions
        if (false === Permissions::get_is_super()) {

            // If enforce private permission is enabled
            // only the user who created the post can see it
            if (Helpers::is_enforce_private_permission($permission_type)) {

                $meta_conditions = array();

                $meta_conditions[] = array(
                    'key'     => 'author',
                    'value'   => get_current_user_id(),
                    'compare' => '='
                );

                $prepared_args['meta_query'][] = $meta_conditions;
            } else {

                $meta_conditions = array(
                    'relation' => 'OR'
                );

                $meta_conditions[] = array(
                    'key'     => $permission_type,
                    'value'   => Permissions::get_user_permissions_list(),
                    'compare' => 'IN'
                );

                if (is_user_logged_in()) {

                    $meta_conditions[] = array(
                        'key'     => 'author',
                        'value'   => get_current_user_id(),
                        'compare' => '='
                    );

                    $meta_conditions[] = array(
                        'key'     => 'super',
                        'value'   => get_current_user_id(),
                        'compare' => '='
                    );
                }

                $prepared_args['meta_query'][] = $meta_conditions;
            }
        }

        if (method_exists($this, 'filter_before_query')) {
            $prepared_args = $this->filter_before_query($prepared_args, $request);
        }

        return $prepared_args;
    }

    public function collection_params($query_params, $post_type) {
        return $query_params;
    }

    protected function prepare_links($post) {
        return array();
    }

    /**
     * Fetch all posts with 100 posts per request
     * @param \WP_REST_Request $request
     * @return Array of posts
     */
    public function get_items_all($request, $current_page = 1, $fetched_items = array()) {

        if (false === is_a($request, 'WP_REST_Request')) {
            return $fetched_items;
        }

        $params = array(
            'page'     => $current_page,
            'per_page' => 100,
        );
        
        foreach ($params as $key => $value) {
            $request->set_param($key, $value);
        }

        $response = $this->get_items($request);

        if (is_wp_error($response)) {
            return $fetched_items;
        }

        $items = $response->get_data();

        if (empty($items)) {
            return $fetched_items;
        }

        $total_pages = $response->get_headers()['X-WP-TotalPages'];

        $fetched_items = array_merge($fetched_items, $items);

        if ($current_page < $total_pages) {
            usleep(100000);
            return $this->get_items_all($request, $current_page + 1, $fetched_items);
        }

        return $fetched_items;
    }

}

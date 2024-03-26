<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * Traits for stec taxonomies
 * 
 * routes: /stec/v5/{taxonomy}/?{id}
 * 
 * methods POST PUT DELETE
 */
trait Rest_Taxonomy_Traits {

    public function __construct($taxonomy) {

        $this->taxonomy  = $taxonomy;
        $this->namespace = 'stec/v5';
        $this->meta      = new \WP_REST_Term_Meta_Fields($taxonomy);

        add_filter("rest_{$this->taxonomy}_query", array($this, 'before_query'), 5, 2);
        add_filter("rest_{$this->taxonomy}_collection_params", array($this, 'collection_params'), 5, 2);
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
                    'args'                => $this->get_collection_params(),
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
                        'description' => esc_html__('Unique identifier for the term.', 'stachethemes_event_calendar_lite'),
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
                            'description' => esc_html__('Required to be true, as terms do not support trashing.', 'stachethemes_event_calendar_lite'),
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
     * Inserts filters to the query
     */
    public function before_query($prepared_args, $request) {

        $permission_type = $request->get_param('permission_type');

        // fallback to read_permission if no permission set
        if (false === in_array($permission_type, array('read_permission', 'use_permission', 'edit_permission'))) {
            $permission_type = 'read_permission';
        }

        if (false === Permissions::get_is_super()) { // needless to say super admin should see everything

            if (Helpers::is_enforce_private_permission($permission_type)) {

                $prepared_args['meta_query'] = array(

                    array(
                        'key'     => 'author',
                        'value'   => get_current_user_id(),
                        'compare' => '='
                    )
                );
            } else {

                // Add meta query only if permission type is not read_permission
                // Read permission is public by default
                // Note sensitive data (e.g. private virtual location address) is handled in get_items() 
                // in their respective controllers
                if ($permission_type !== 'read_permission') {

                    $prepared_args['meta_query'] = array(
                        'relation' => 'OR',
                        array(
                            'key'     => $permission_type,
                            'value'   => Permissions::get_user_permissions_list(),
                            'compare' => 'IN'
                        ),
                        array(
                            'key'     => 'author',
                            'value'   => get_current_user_id(),
                            'compare' => '='
                        )
                    );
                }
            }
        }

        if (method_exists($this, 'filter_before_query')) {
            $prepared_args = $this->filter_before_query($prepared_args, $request);
        }

        return $prepared_args;
    }

    public function collection_params($query_params, $taxonomy) {
        return $query_params;
    }

    protected function prepare_links($term) {
        return array();
    }

    /**
     * Fetch all terms with 100 terms per request
     * @param \WP_REST_Request $request
     * @return Array of terms
     */
    public function get_items_all($request, $current_page = 1, $fetched_items = array()) {

        if (false === is_a($request, 'WP_REST_Request')) {
            return $fetched_items;
        }

        $params = array(
            'page'       => $current_page,
            'per_page'   => 100,
            'hide_empty' => false,
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

    /**
     * Decodes "&amp;" characters in the "name" field of an item
     * used by get_items() and get_item()
     */
    private function decode_item($item) {
        $item['name'] = html_entity_decode($item['name'], ENT_QUOTES, 'UTF-8');
        return $item;
    }

    /**
     * Get items for the REST API request.
     *
     * @param WP_REST_Request $request The REST API request object.
     * @return WP_REST_Response The REST API response object.
     */
    public function get_items($request) {
        // Get the items from the parent class.
        $items = parent::get_items($request);

        // Get the item data and the hide emails setting.
        $data = $items->get_data();
        $hide_emails = (bool) Settings::get('calendar', 'hide_emails');

        // Map over the data and decode each item.
        $data = array_map(function ($item) use ($hide_emails) {
            // If hide emails is enabled and the user is not logged in, remove the email from the item meta.
            if ($hide_emails && !is_user_logged_in()) {
                if ($item['meta']['email'] !== null) {
                    $item['meta']['email'] = '';
                }
            }

            // Decode the item and return it.
            return $this->decode_item($item);
        }, $data);

        // Set the data on the response object and return it.
        $items->set_data($data);
        return $items;
    }

    /**
     * Get a single item for the REST API request.
     *
     * @param WP_REST_Request $request The REST API request object.
     * @return WP_REST_Response The REST API response object.
     */
    public function get_item($request) {
        // Get the item data from the parent class.
        $item = parent::get_item($request);
        $item_data = $item->get_data();

        // Get the hide emails setting.
        $hide_emails = (bool) Settings::get('calendar', 'hide_emails');

        // If hide emails is enabled and the user is not logged in, remove the email from the item meta.
        if ($hide_emails && !is_user_logged_in()) {
            if (isset($item_data['meta']['email'])) {
                $item_data['meta']['email'] = '';
            }
        }

        // Set the modified item data on the response object and return it.
        $modified_item_data = $this->decode_item($item_data);
        $item->set_data($modified_item_data);
        return $item;
    }
}

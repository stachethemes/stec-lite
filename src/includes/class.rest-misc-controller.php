<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * Misc API Controller
 * Registers misc routes not fitting anywhere else.
 * They don't share common rest_base
 */
class Rest_Misc_Controller {

    protected $namespace = 'stec/v5';
    protected $rest_base = '/';

    public function init() {

        $this->register_routes();
    }

    public function register_routes() {

        register_rest_route(
            $this->namespace,
            $this->rest_base . 'users',
            array(

                array(
                    'methods'             => \WP_REST_Server::READABLE,
                    'callback'            => array($this, 'get_users'),
                    'permission_callback' => function () {
                        return current_user_can('edit_users');
                    }
                ),
                'args' => array(
                    's' => array(
                        'description' => 'Search term',
                        'type' => 'string',
                    )
                )
            )
        );

        register_rest_route(
            $this->namespace,
            $this->rest_base . 'dashboard-counters',
            array(

                array(
                    'methods'             => \WP_REST_Server::READABLE,
                    'callback'            => array($this, 'get_dashboard_counters'),
                    'permission_callback' => function () {
                        return is_user_logged_in();
                    },
                )
            )
        );

        register_rest_route(
            $this->namespace,
            $this->rest_base . 'upload-images',
            array(
                array(
                    'methods'             => \WP_REST_Server::EDITABLE,
                    'callback'            => array($this, 'upload_images'),
                    'permission_callback' => function () {
                        return current_user_can('stec_upload_images');
                    }
                )
            )
        );
    }

    public function get_dashboard_posts_count($post_type, $args = array()) {

        if ('stec_event' === $post_type) {
            $result = Events::get_rest_events(
                array(
                    'fields'          => 'ids',
                    'context'         => 'view',
                    'permission_type' => 'edit_permission',
                    'lang'            => isset($args['lang']) ? $args['lang'] : ''
                )
            );

            if (is_wp_error($result)) {
                return 0;
            }

            return count($result);
        }

        return 0;
    }

    public function get_dashboard_terms_count($taxonomy, $args = array()) {

        if (Permissions::get_is_super()) {

            $query_args = array(
                'taxonomy'   => $taxonomy,
                'hide_empty' => false,
            );

            $result = wp_count_terms(
                $query_args
            );

            if (!is_numeric($result)) {
                return 0;
            }

            return (int) $result;
        }

        if (Helpers::is_enforce_private_permission('edit_permission')) {

            $query_args = array(
                'taxonomy'   => $taxonomy,
                'hide_empty' => false,
                'meta_query' => array(
                    array(
                        'key'     => 'author',
                        'value'   => get_current_user_id(),
                        'compare' => '='
                    )
                )
            );
        } else {

            $query_args = array(
                'taxonomy'   => $taxonomy,
                'hide_empty' => false,
                'meta_query' => array(
                    'relation' => 'OR',
                    array(
                        'key'     => 'edit_permission',
                        'value'   => Permissions::get_user_permissions_list(),
                        'compare' => 'IN'
                    ),
                    array(
                        'key'     => 'author',
                        'value'   => get_current_user_id(),
                        'compare' => '='
                    )
                )
            );
        }

        $result = wp_count_terms($query_args);

        if (!is_numeric($result)) {
            return 0;
        }

        return (int) $result;
    }

    public function get_dashboard_counters(\WP_REST_Request $request) {

        $args = array();

        $return_data = array(
            'calendars'     => $this->get_dashboard_terms_count('stec_cal', $args),
            'events'        => $this->get_dashboard_posts_count('stec_event', $args),
            'categories'    => $this->get_dashboard_terms_count('stec_cat', $args),
            'organizers'    => $this->get_dashboard_terms_count('stec_org', $args),
            'guests'        => $this->get_dashboard_terms_count('stec_gst', $args),
            'locations'     => $this->get_dashboard_terms_count('stec_loc', $args)
        );

        $response = rest_ensure_response($return_data);

        return $response;
    }

    public function get_users(\WP_REST_Request $request) {

        $response_data = array();
        $status_code   = 200;

        try {

            $search = $request->get_param('s');

            if (!$search) {
                throw new Stec_Exception(esc_html__('Missing search term', 'stachethemes_event_calendar_lite'));
            }

            $data_fields = array('ID', 'user_login', 'user_email', 'display_name');

            if (is_numeric($search)) {

                $userId = (int) $search;

                $users = get_users(array(
                    'number'  => 1,
                    'include' => array($userId),
                    'fields'  => $data_fields,
                ));
            } else {

                $users = get_users(array(
                    'number'         => 1,
                    'search'         => '*' . $search . '*',
                    'search_columns' => array('user_login', 'user_email', 'display_name'),
                    'number'         => 10,
                    'fields'         => $data_fields,
                ));
            }


            if (false === is_wp_error($users)) {
                $response_data = $users;
            }
        } catch (Stec_Exception $ex) {

            $status_code              = 400;
            $response_data['message'] = $ex->getMessage();
        }

        $response = new \WP_REST_Response($response_data, $status_code);

        return $response;
    }

    public function upload_images(\WP_REST_Request $request) {

        try {

            $data  = $request->get_file_params();
            $files = array();

            foreach ($data['file']['name'] as $k => $v) {
                $files[$k]['name']     = $data['file']['name'][$k];
                $files[$k]['type']     = $data['file']['type'][$k];
                $files[$k]['tmp_name'] = $data['file']['tmp_name'][$k];
                $files[$k]['error']    = $data['file']['error'][$k];
                $files[$k]['size']     = $data['file']['size'][$k];
            }

            // Validate that all files are images
            foreach ($files as $file) {
                if (!in_array($file['type'], array('image/jpeg', 'image/png'))) {
                    throw new Stec_Exception(esc_html__('Invalid file type', 'stachethemes_event_calendar_lite'));
                }
            }

            $attachments_ids = Helpers::upload_images($files);
            $result          = array();

            if (is_array($attachments_ids) && $attachments_ids) {

                $result = array_map(function ($id) {

                    $sizes = array('full', 'large', 'medium', 'thumbnail');

                    $result = array(
                        'id' => $id,
                        'sizes' => array(),
                        'url' => wp_get_attachment_url($id)
                    );

                    foreach ($sizes as $size) {
                        $attachment = wp_get_attachment_image_src($id, $size);
                        $result['sizes'][$size] = array(
                            'width'  => $attachment[1],
                            'height' => $attachment[2],
                            'url'    => $attachment[0],
                        );
                    }

                    return $result;
                }, $attachments_ids);
            }

            return $result;
        } catch (Stec_Exception $ex) {

            $error = new \WP_Error('stec_upload_images_error', $ex->getMessage());

            return rest_ensure_response($error);
        }
    }
}

add_action('rest_api_init', function () {

    $route = new Rest_Misc_Controller();
    $route->init();
});

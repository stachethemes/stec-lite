<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Rest_Stec_Gst_Controller extends \WP_REST_Terms_Controller {

    use Rest_Taxonomy_Traits;

    protected $rest_base = 'guests';

    public function read_permission(\WP_REST_Request $request) {

        /**
         * If permission_type is inlcuded in the read request check if the user has the global capability
         * E.g. Show me the organizers I can 'edit' or I can 'use'
         */
        $permission_type = $request->get_param('permission_type');

        switch ($permission_type) {

            case 'use_permission':

                return current_user_can("assign_{$this->taxonomy}");

                break;

            case 'edit_permission':

                return current_user_can("manage_{$this->taxonomy}");

                break;

            default:

                return current_user_can("read_{$this->taxonomy}");
        }
    }

    public function create_permission(\WP_REST_Request $request) {

        return current_user_can("manage_{$this->taxonomy}");
    }

    public function edit_permission(\WP_REST_Request $request) {

        $id = $request->get_param('id');

        return Permissions::current_user_has_term_permission($id, $this->taxonomy, 'edit_permission');
    }

    public function delete_permission(\WP_REST_Request $request) {

        $id = $request->get_param('id');

        return Permissions::current_user_has_term_permission($id, $this->taxonomy, 'edit_permission');
    }

    public function create_item($request) {

        $data = $request->get_json_params();

        // Auto populate the author id
        $data['meta']['author'] = get_current_user_id();

        $encodedData = wp_json_encode($data);
        $request->set_body($encodedData);

        return parent::create_item($request);
    }
}

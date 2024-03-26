<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Rest_Stec_Org_Controller extends \WP_REST_Terms_Controller {

    use Rest_Taxonomy_Traits;

    protected $rest_base = 'organizers';

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

    public function update_item($request) {

        $id = (int) $request->get_param('id');

        $data = $request->get_json_params();

        $old_meta_verified = (bool) get_term_meta($id, 'verified', true);

        if ($old_meta_verified !== (bool) $data['meta']['verified']) {
            if (false === current_user_can('stec_verify_persons')) {
                return new \WP_Error(
                    'stec_verify_persons',
                    esc_html__('You do not have permission to verify organizers', 'stachethemes_event_calendar_lite')
                );
            }
        }

        $encodedData = wp_json_encode($data);
        $request->set_body($encodedData);

        return parent::update_item($request);
    }

    public function create_item($request) {

        $data = $request->get_json_params();

        // Auto populate the author id
        $data['meta']['author'] = get_current_user_id();

        if (true === (bool) $data['meta']['verified']) {
            if (false === current_user_can('stec_verify_persons')) {
                return new \WP_Error(
                    'stec_verify_persons',
                    esc_html__('You do not have permission to verify organizers', 'stachethemes_event_calendar_lite')
                );
            }
        }

        $encodedData = wp_json_encode($data);
        $request->set_body($encodedData);

        return parent::create_item($request);
    }
}

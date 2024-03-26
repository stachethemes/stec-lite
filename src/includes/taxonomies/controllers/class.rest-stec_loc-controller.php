<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Rest_Stec_Loc_Controller extends \WP_REST_Terms_Controller {

    use Rest_Taxonomy_Traits;

    protected $rest_base = 'locations';

    public function read_permission(\WP_REST_Request $request) {

        /**
         * If permission_type is included in the read request check if the user has the global capability
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

    public function get_items($request) {

        $permission_type = $request->get_param('permission_type');

        $items = parent::get_items($request);

        if ($permission_type === 'edit_permission') {
            return $items;
        }

        $data = $items->get_data();

        foreach ($data as $k => $location) {

            if ($location['meta']['protected'] === false) {
                continue;
            }

            if (is_user_logged_in()) {
                continue;
            }

            $data[$k]['description'] = esc_html__('Only logged-in users can read the description', 'stachethemes_event_calendar_lite');
            $data[$k]['meta']['address'] = esc_html__('Only logged-in users can read the address', 'stachethemes_event_calendar_lite');
        }

        $items->set_data($data);

        return $items;
    }

    public function get_item($request) {

        $item = parent::get_item($request);
        
        $data = $item->get_data();

        if ($data['meta']['protected'] === false) {
            return $item;
        }

        if (is_user_logged_in()) {
            return $item;
        }

        $data['description'] = esc_html__('Only logged-in users can read the description', 'stachethemes_event_calendar_lite');
        $data['meta']['address'] = esc_html__('Only logged-in users can read the address', 'stachethemes_event_calendar_lite');

        $item->set_data($data);

        return $item;
    }
}

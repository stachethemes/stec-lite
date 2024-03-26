<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Rest_Stec_Cal_Controller extends \WP_REST_Terms_Controller {

    use Rest_Taxonomy_Traits;

    protected $rest_base = 'calendars';

    public function read_permission(\WP_REST_Request $request) {

        /**
         * If permission_type is inlcuded in the read request check if the user has the global capability
         * E.g. Show me the calendars I can 'edit' or I can 'use'
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

    public function update_item($request) {

        $data = $request->get_json_params();

        $old_author = get_term_meta($request->get_param('id'), 'author', true);
        $new_author = $data['meta']['author'];
        $is_changing_author = $old_author !== $new_author;

        $old_timezone = get_term_meta($request->get_param('id'), 'timezone', true);
        $new_timezone = $data['meta']['timezone'];

        $encodedData = wp_json_encode($data);
        $request->set_body($encodedData);

        $result = parent::update_item($request);

        if (is_wp_error($result)) {
            return $result;
        }

        // if the timezone of the calendar has changed, update the timezone of all events assigned to this calendar
        if ($old_timezone !== $new_timezone) {

            // get all stec_event posts ids that are assigned to this calendar
            $posts = get_posts(array(
                'fields'         => 'ids',
                'post_type'      => 'stec_event',
                'posts_per_page' => -1,
                'tax_query'      => array(
                    array(
                        'taxonomy' => 'stec_cal',
                        'field'    => 'term_id',
                        'terms'    => $request->get_param('id')
                    )
                ),
                'meta_query'    => array(
                    array(
                        'key'     => 'timezone',
                        'value'   => 'stec_cal_default',
                        'compare' => '='
                    )
                )
            ));

            // update the timezone and utc meta of all stec_event posts
            foreach ($posts as $post_id) {

                $event_start_date     = get_post_meta($post_id, 'start_date', true);
                $event_end_date       = get_post_meta($post_id, 'end_date', true);
                $event_start_date_utc = Helpers::get_datetime_utc($event_start_date, $new_timezone);
                $event_end_date_utc   = Helpers::get_datetime_utc($event_end_date, $new_timezone);

                update_post_meta($post_id, 'start_date_utc', $event_start_date_utc);
                update_post_meta($post_id, 'end_date_utc', $event_end_date_utc);
            }
        }

        // if is changing author refresh events super meta
        if ($is_changing_author) {

            // get all stec_event posts ids that has super equals to $old_author
            $events = get_posts(array(
                'fields'         => 'ids',
                'post_type'      => 'stec_event',
                'posts_per_page' => -1,
                'meta_query'      => array(
                    array(
                        'key'     => 'super',
                        'value'   => $old_author,
                        'compare' => '='
                    )
                )
            ));

            if (!is_wp_error($events)) {
                foreach ($events as $events_id) {
                    update_post_meta($events_id, 'super', $new_author);
                }
            }
        }

        return $result;
    }
}

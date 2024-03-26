<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Events {

    /**
     * Retrieve all override dates (recurrence_id meta value) for the event by uid
     */
    public static function get_recurrence_override_dates($uid) {

        $recurrence_ids_array = array();

        $events = get_posts(
            array(
                'post_type'      => 'stec_event',
                'fields'         => 'ids',
                'posts_per_page' => -1,
                'post_status'    => array('publish', 'stec_archived'),
                'meta_query'     => array(
                    'relation' => 'AND',
                    array(
                        'key'     => 'uid',
                        'value'   => $uid,
                        'compare' => '='
                    ),
                    array(
                        'key'     => 'recurrence_id',
                        'compare' => 'EXISTS'
                    )
                )
            )
        );

        if (is_wp_error($events) || empty($events)) {
            return $recurrence_ids_array;
        }

        foreach ($events as $id) {

            $recurrence_id = get_post_meta($id, 'recurrence_id', true);

            if ($recurrence_id) {
                $recurrence_ids_array[] = array(
                    'event_id'      => $id,
                    'recurrence_id' => $recurrence_id
                );
            }
        }

        return $recurrence_ids_array;
    }


    /**
     * Checks if event date has occurrence override and returns the event id of the override
     * @param int $event_id
     * @param string $start_date
     * @return int|boolean
     */
    public static function get_event_recurrence_override($event_id, $start_date = false) {

        $rrule             = get_post_meta($event_id, 'rrule', true);
        $has_recurrence_id = get_post_meta($event_id, 'recurrence_id', true);

        if (!$rrule || $has_recurrence_id) {
            return false;
        }

        if (!$start_date) {
            $start_date = get_post_meta($event_id, 'start_date', true);
        }

        $uid = get_post_meta($event_id, 'uid', true);

        if (!$uid) {
            return false;
        }

        $recurrence_id = explode('T', $start_date)[0];

        $results = get_posts(array(
            'post_type'      => 'stec_event',
            'post_status'    => array('publish', 'stec_archived'),
            'fields'         => 'ids',
            'meta_query'     => array(
                'relation' => 'AND',
                array(
                    'key'     => 'uid',
                    'value'   => $uid,
                    'compare' => '='
                ),
                array(
                    'key'     => 'recurrence_id',
                    'value'   => $recurrence_id,
                    'compare' => '='
                )
            )
        ));

        if (empty($results)) {
            return false;
        }

        return max($results);
    }

    public static function get_rest_events($args = array()) {

        global $wp_query;

        $default_args = array(
            'context'           => 'event',
            'page'              => 1,
            'per_page'          => Settings::get('misc', 'events_per_request', 100),
            'permission_type'   => 'read_permission'
        );

        $args           = Helpers::wp_parse_args($args, $default_args);
        $fetched_events = array();

        $wp_query->query_vars['stec_doing_prefetch'] = true;

        while (true) {

            $request = new \WP_REST_Request(\WP_REST_Server::READABLE, '/stec/v5/events');

            foreach ($args as $param => $param_value) {
                $request->set_param($param, $param_value);
            }

            $response = rest_do_request($request);

            if ($response->is_error()) {
                return array();
            }

            $headers        = $response->get_headers();
            $total_pages    = (int) $headers['X-WP-TotalPages'];
            $current_page   = (int) $request->get_param('page');
            $fetched_events = array_merge($fetched_events, $response->get_data());

            if ($current_page >= $total_pages) {
                break;
            }

            $args['page'] = $current_page + 1;
        }

        unset($wp_query->query_vars['stec_doing_prefetch']);

        do_action('stec_events_get_rest_events_after_loop');

        return $fetched_events;
    }

    public static function get_rest_event($args = array()) {

        global $wp_query;

        $default_args = array(
            'context'           => 'event',
            'permission_type'   => 'read_permission'
        );

        $args = Helpers::wp_parse_args($args, $default_args);
        $request = new \WP_REST_Request(\WP_REST_Server::READABLE, '/stec/v5/events/' . $args['id']);

        foreach ($args as $param => $param_value) {
            $request->set_param($param, $param_value);
        }

        // ! Set flag to prevent potential infinite loop 
        $wp_query->query_vars['stec_doing_prefetch'] = true;

        $response = rest_do_request($request);

        unset($wp_query->query_vars['stec_doing_prefetch']);

        if ($response->is_error()) {
            return false;
        }

        $event = $response->get_data();


        return $event;
    }

}

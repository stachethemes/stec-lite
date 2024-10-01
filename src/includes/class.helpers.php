<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

class Helpers {

    public static function get_file_contents($file) {

        require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-base.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-direct.php';

        $filesystem = new \WP_Filesystem_Direct(true);

        $content = $filesystem->get_contents($file);

        return $content;
    }

    /**
     * Similiar to wp_parse_args but with recursive array_replace
     */
    public static function wp_parse_args($args, $defaults = array()) {

        if (is_object($args)) {
            $parsed_args = get_object_vars($args);
        } elseif (is_array($args)) {
            $parsed_args = &$args;
        } else {
            wp_parse_str($args, $parsed_args);
        }

        if (is_array($defaults) && $defaults) {
            return array_replace_recursive($defaults, $parsed_args);
        }
        return $parsed_args;
    }

    /**
     * Get the event timezone
     * @param int $event_id Event ID
     * @return string Timezone
     */
    public static function get_event_timezone($event_id) {

        $timezone = get_post_meta($event_id, 'timezone', true);

        if ('stec_cal_default' === $timezone) {

            $calendar_terms = wp_get_post_terms($event_id, 'stec_cal');

            if ($calendar_terms && !is_wp_error($calendar_terms)) {
                $calendar = array_pop($calendar_terms);
                $timezone = get_term_meta($calendar->term_id, 'timezone', true);
            }
        }

        return $timezone;
    }

    /**
     * Validate date fromat
     * @param string $date Date to validate
     * @param string $format Date format 
     * @return bool
     */
    public static function is_valid_date($date, $format = 'Y-m-d\TH:i') {
        $test = \DateTime::createFromFormat($format, $date);
        return $test && $test->format($format) === $date;
    }

    public static function is_enforce_private_permission($type = 'read_permission') {

        switch ($type) {

            case 'edit_permission':
            case 'use_permission': {
                    return Settings::get('dashboard', 'enforce_private_admin');
                }

            case 'read_permission':
            default:
                return Settings::get('dashboard', 'enforce_private_front');;
        }
    }

    /**
     * Upload images to wp media library
     * Stores the image content hash in the _stec_attachment_hash custom key via
     * which we can check if the image already exists in the media library
     * @throws Stec_Exception
     * @param array $files Array of files to upload
     * @return array Array of attachment IDs
     */
    public static function upload_images($files) {

        if (!is_array($files)) {
            return array();
        }

        global $wpdb;

        if (!function_exists('wp_crop_image')) {
            include_once(ABSPATH . 'wp-admin/includes/image.php');
        }

        $result = array();

        foreach ($files as $file) {

            // Check if attachment exists using the _wp_attachment_metadata custom key
            $content = self::get_file_contents($file['tmp_name']);

            $image_content_hash = wp_hash($content);

            $attachment_id = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = '_stec_attachment_hash' AND meta_value = %s",
                    $image_content_hash
                )
            );

            if (is_numeric($attachment_id) && $attachment_id > 0) {
                $result[] = (int) $attachment_id;
                continue;
            }

            $upload = wp_upload_bits($file['name'], null, self::get_file_contents($file['tmp_name']));

            if (!$upload['error']) {

                // File was successfully uploaded
                $attachment = array(
                    'post_title'     => sanitize_file_name($file['name']),
                    'post_content'   => '',
                    'post_status'    => 'inherit',
                    'post_mime_type' => $file['type']
                );

                $attach_id = wp_insert_attachment($attachment, $upload['file']);

                // Generate attachment metadata and update the attachment
                $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
                wp_update_attachment_metadata($attach_id, $attach_data);

                add_post_meta($attach_id, '_stec_attachment_hash', $image_content_hash);

                // Add the attachment ID to your $result array
                $result[] = $attach_id;
            } else {
                // translators: %s is error message
                throw new Stec_Exception(sprintf(esc_html__('Error uploading file: %s', 'stachethemes_event_calendar_lite'), esc_html($upload['error'])));
            }
        }

        return $result;
    }

    public static function get_datetime_utc($dateString, $timezone, $format = 'Y-m-d\TH:i') {

        $datetime = new \DateTime($dateString, new \DateTimeZone($timezone));
        $datetime = $datetime->setTimezone(new \DateTimeZone('UTC'));

        return $datetime->format($format);
    }

    /**
     * Get datetime diff in seconds
     */
    public static function get_datetime_diff($date_string1, $date_string2) {

        $date1 = new \DateTime($date_string1, new \DateTimeZone('UTC'));
        $date2 = new \DateTime($date_string2, new \DateTimeZone('UTC'));

        $diff = $date1->diff($date2);

        return $diff->days * 24 * 60 * 60 + $diff->h * 60 * 60 + $diff->i * 60 + $diff->s;
    }

    public static function get_dynamic_date($dateString, $dateFormat = 'Y-m-d\TH:i') {

        $first_day_of_the_week = Settings::get('calendar', 'dow'); /* 0 - 6 where 0 is Sunday */
        $dateRegexTest         = '/^([0-9]{4}-[0-9]{2}-[0-9]{2})(T[0-9]{2}:[0-9]{2})?$/';

        switch ($dateString) {
            case 'now':

                return gmdate($dateFormat, strtotime('now'));

            case 'start_of_today':

                return gmdate($dateFormat, strtotime('midnight'));

            case 'end_of_today':

                return gmdate($dateFormat, strtotime('tomorrow - 1 second'));

            case 'start_of_this_week':

                $start_of_week = strtotime('last sunday', strtotime('tomorrow - 1 second'));
                $start_of_week = strtotime('+' . $first_day_of_the_week . ' days', $start_of_week);

                return gmdate($dateFormat, $start_of_week);

            case 'end_of_this_week':

                $end_of_week = strtotime('next sunday', strtotime('tomorrow - 1 second'));
                $end_of_week = strtotime('+' . $first_day_of_the_week . ' days', $end_of_week);

                return gmdate($dateFormat, $end_of_week);

            case 'start_of_prev_week':

                $start_of_week = strtotime('last sunday', strtotime('tomorrow - 1 second'));
                $start_of_week = strtotime('+' . $first_day_of_the_week . ' days', $start_of_week);
                $start_of_week = strtotime('-1 week', $start_of_week);

                return gmdate($dateFormat, $start_of_week);


            case 'end_of_prev_week':

                $end_of_week = strtotime('next sunday', strtotime('tomorrow - 1 second'));
                $end_of_week = strtotime('+' . $first_day_of_the_week . ' days', $end_of_week);
                $end_of_week = strtotime('-1 week', $end_of_week);

                return gmdate($dateFormat, $end_of_week);

            case 'start_of_next_week':

                $start_of_week = strtotime('last sunday', strtotime('tomorrow - 1 second'));
                $start_of_week = strtotime('+' . $first_day_of_the_week . ' days', $start_of_week);
                $start_of_week = strtotime('+1 week', $start_of_week);

                return gmdate($dateFormat, $start_of_week);

            case 'end_of_next_week':

                $end_of_week = strtotime('next sunday', strtotime('tomorrow - 1 second'));
                $end_of_week = strtotime('+' . $first_day_of_the_week . ' days', $end_of_week);
                $end_of_week = strtotime('+1 week', $end_of_week);

                return gmdate($dateFormat, $end_of_week);

            case 'start_of_this_month':

                $start_of_month = strtotime('first day of this month', strtotime('tomorrow - 1 second'));

                return gmdate($dateFormat, $start_of_month);

            case 'end_of_this_month':

                $end_of_month = strtotime('last day of this month', strtotime('tomorrow - 1 second'));

                return gmdate($dateFormat, $end_of_month);

            case 'start_of_prev_month':

                $start_of_month = strtotime('first day of this month', strtotime('tomorrow - 1 second'));
                $start_of_month = strtotime('-1 month', $start_of_month);

                return gmdate($dateFormat, $start_of_month);

            case 'end_of_prev_month':

                $end_of_month = strtotime('last day of this month', strtotime('tomorrow - 1 second'));
                $end_of_month = strtotime('-1 month', $end_of_month);

                return gmdate($dateFormat, $end_of_month);

            case 'start_of_next_month':

                $start_of_month = strtotime('first day of this month', strtotime('tomorrow - 1 second'));
                $start_of_month = strtotime('+1 month', $start_of_month);

                return gmdate($dateFormat, $start_of_month);

            case 'end_of_next_month':

                $end_of_month = strtotime('last day of this month', strtotime('tomorrow - 1 second'));
                $end_of_month = strtotime('+1 month', $end_of_month);

                return gmdate($dateFormat, $end_of_month);

            case 'start_of_this_year':

                $start_of_year = strtotime('first day of january', strtotime('tomorrow - 1 second'));

                return gmdate($dateFormat, $start_of_year);

            case 'end_of_this_year':

                $end_of_year = strtotime('last day of december', strtotime('tomorrow - 1 second'));

                return gmdate($dateFormat, $end_of_year);

            case 'start_of_prev_year':

                $start_of_year = strtotime('first day of january', strtotime('tomorrow - 1 second'));
                $start_of_year = strtotime('-1 year', $start_of_year);

                return gmdate($dateFormat, $start_of_year);

            case 'end_of_prev_year':

                $end_of_year = strtotime('last day of december', strtotime('tomorrow - 1 second'));
                $end_of_year = strtotime('-1 year', $end_of_year);

                return gmdate($dateFormat, $end_of_year);

            case 'start_of_next_year':

                $start_of_year = strtotime('first day of january', strtotime('tomorrow - 1 second'));
                $start_of_year = strtotime('+1 year', $start_of_year);

                return gmdate($dateFormat, $start_of_year);

            case 'end_of_next_year':

                $end_of_year = strtotime('last day of december', strtotime('tomorrow - 1 second'));
                $end_of_year = strtotime('+1 year', $end_of_year);

                return gmdate($dateFormat, $end_of_year);

            case '3_months_ahead':

                $date = strtotime('tomorrow - 1 second');
                $date = strtotime('+3 months', $date);

                return gmdate($dateFormat, $date);

            case '3_months_ago':

                $date = strtotime('tomorrow - 1 second');
                $date = strtotime('-3 months', $date);

                return gmdate($dateFormat, $date);

            case '6_months_ahead':

                $date = strtotime('tomorrow - 1 second');
                $date = strtotime('+6 months', $date);

                return gmdate($dateFormat, $date);

            case '6_months_ago':

                $date = strtotime('tomorrow - 1 second');
                $date = strtotime('-6 months', $date);

                return gmdate($dateFormat, $date);

            case '1_year_ahead':

                $date = strtotime('tomorrow - 1 second');
                $date = strtotime('+1 year', $date);

                return gmdate($dateFormat, $date);

            case '1_year_ago':

                $date = strtotime('tomorrow - 1 second');
                $date = strtotime('-1 year', $date);

                return gmdate($dateFormat, $date);

            case '2_years_ahead':

                $date = strtotime('tomorrow - 1 second');
                $date = strtotime('+2 years', $date);

                return gmdate($dateFormat, $date);

            case '2_years_ago':

                $date = strtotime('tomorrow - 1 second');
                $date = strtotime('-2 years', $date);

                return gmdate($dateFormat, $date);

            default:
                $dateString = preg_match($dateRegexTest, $dateString) ? $dateString : '';

                // Date is expected to be in UTC
                if ($dateString) {
                    $date = new \DateTime($dateString, new \DateTimeZone('UTC'));
                    return $date->format($dateFormat);
                }

                return '';
        }
    }

    public static function to_wp_date($date_string) {

        try {

            $format   = array();
            $format[] = get_option('date_format');
            $format[] = get_option('time_format');
            $format   = implode(' ', $format);

            $result = wp_date($format, strtotime($date_string), new \DateTimeZone('UTC'));

            return $result;
        } catch (\Exception $ex) {

            return $date_string;
        }
    }

    public static function get_timezone_abbr($timezone) {

        $timezone = new \DateTimeZone($timezone);
        $date     = new \DateTime('now', $timezone);

        return $date->format('T');
    }

    public static function get_date_in_user_timezone($date, $timezone, $user_timezone, $format = 'Y-m-d\TH:i') {
        $dateObject = new \DateTime($date, new \DateTimeZone($timezone));
        $dateObject->setTimezone(new \DateTimeZone($user_timezone));
        return $dateObject->format($format);
    }

    public static function get_user_email($id = false) {

        if (!$id) {
            $id = get_current_user_id();
        }

        $user = get_user_by('id', $id);

        if (!$user) {
            return '';
        }

        return $user->user_email;
    }

    public static function get_user_by_email($email = false) {

        if (!$email) {
            return false;
        }

        $user = get_user_by('email', $email);

        if (!$user) {
            return false;
        }

        return $user;
    }
}

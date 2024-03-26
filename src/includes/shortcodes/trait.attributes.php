<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

trait Shortcode_Attributes {

    /**
     * Convert __return_true and __return_false to boolean
     * Cast any numeric value found to number
     * Convert current_user to current user id
     * 
     * @param array $shortcode_atts shortcode attributes
     * @return array converted shortcode attributes
     */
    public static function convert_attributes($shortcode_atts = array()) {

        $converted = array();

        foreach ($shortcode_atts as $k => $att) {

            if (in_array($k, array('filter__min_date','min_date','filter__max_date','max_date'))) {
                $converted[$k] = Helpers::get_dynamic_date($att);
                continue;
            }

            if ($att === 'current_user') {
                $att = get_current_user_id();
            }

            if ($att === '__return_true' || $att === 'true') {
                $att = true;
            }

            if ($att === '__return_false' || $att === 'false') {
                $att = false;
            }

            if (is_numeric($att)) {
                $att = (float) $att;
            }

            $converted[$k] = $att;
        }

        return $converted;

    }
}

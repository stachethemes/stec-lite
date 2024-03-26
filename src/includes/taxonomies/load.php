<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * Register taxonomies
 */
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/trait.taxonomy-helpers.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/class.taxonomy-stec_cal.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/class.taxonomy-stec_cat.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/class.taxonomy-stec_loc.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/class.taxonomy-stec_org.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/class.taxonomy-stec_gst.php';

/**
 * Register taxonomies rest controllers
 */
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/controllers/trait.rest-taxonomy-traits.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/controllers/class.rest-stec_cal-controller.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/controllers/class.rest-stec_cat-controller.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/controllers/class.rest-stec_loc-controller.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/controllers/class.rest-stec_gst-controller.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/taxonomies/controllers/class.rest-stec_org-controller.php';
<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/shortcodes/trait.attributes.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/shortcodes/trait.force-load.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/shortcodes/trait.helpers.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/shortcodes/shortcode.stec.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/shortcodes/shortcode.stec_single.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/shortcodes/shortcode.stec_dashboard.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/shortcodes/shortcode.stec_events_slider.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/shortcodes/shortcode.stec_events_list.php';
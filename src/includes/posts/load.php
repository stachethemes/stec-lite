<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * Register posts
 */
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/posts/trait.post-helpers.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/posts/class.post-stec_event.php';

/**
 * Register posts rest controllers
 */
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/posts/controllers/trait.rest-post-traits.php';
include_once STEC_LITE_PLUGIN_ABS_PATH . 'includes/posts/controllers/class.rest-stec_event-controller.php';
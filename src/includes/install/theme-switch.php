<?php

namespace Stachethemes\Steclite;

/**
 * * On theme switch
 */
add_action('after_switch_theme', '\Stachethemes\Steclite\on_theme_switch');

function on_theme_switch() {
    
    do_action('stec_on_theme_switch');

}

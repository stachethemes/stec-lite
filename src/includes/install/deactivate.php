<?php

namespace Stachethemes\Steclite;

/**
 * * Deactivation hook
 */
register_deactivation_hook(STEC_LITE_PLUGIN_FILE, '\Stachethemes\Steclite\on_deactivate');

function on_deactivate() {

}

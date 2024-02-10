<?php

include_once '../../../../../wp-load.php';

header("Content-type: text/css; charset: UTF-8");

$CSS = \Stachethemes\StecLite\Settings::get('fac');

if (array_key_exists('custom-style', $CSS)) {
    $CUSTOM_STYLE = $CSS['custom-style'];
    unset($CSS['custom-style']);
} else {
    $CUSTOM_STYLE = '';
}

$CSS_ARRAY = array();

$CSS_ARRAY[] = ':root {';

foreach ($CSS as $var => $value) {
    $CSS_ARRAY[] = sprintf('--stec-%s:%s;', $var, $value);
}

$CSS_ARRAY[] = '}';
$CSS_ARRAY[] = PHP_EOL;
$CSS_ARRAY[] = PHP_EOL;

if ($CUSTOM_STYLE) {
    $CSS_ARRAY[] = PHP_EOL;
    $CSS_ARRAY[] = $CUSTOM_STYLE;
    $CSS_ARRAY[] = PHP_EOL;
    $CSS_ARRAY[] = PHP_EOL;
}

echo implode('', $CSS_ARRAY);
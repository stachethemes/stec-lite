<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInita39b9af53af3ee46ef1aaad9e3c3e00d
{
    public static $files = array (
        '3773ef3f09c37da5478d578e32b03a4b' => __DIR__ . '/..' . '/automattic/jetpack-assets/actions.php',
    );

    public static $classMap = array (
        'Automattic\\Jetpack\\Assets' => __DIR__ . '/..' . '/automattic/jetpack-assets/src/class-assets.php',
        'Automattic\\Jetpack\\Assets\\Semver' => __DIR__ . '/..' . '/automattic/jetpack-assets/src/class-semver.php',
        'Automattic\\Jetpack\\Constants' => __DIR__ . '/..' . '/automattic/jetpack-constants/src/class-constants.php',
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->classMap = ComposerStaticInita39b9af53af3ee46ef1aaad9e3c3e00d::$classMap;

        }, null, ClassLoader::class);
    }
}

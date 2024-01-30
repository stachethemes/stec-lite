<?php

namespace Stachethemes\Steclite;

class Cache {

    protected static $cache_folder = 'cache/';

    protected static function do_cache() {
        return true;
    }

    protected static function get_cache_folder() {
        return STEC_LITE_PLUGIN_ABS_PATH . DIRECTORY_SEPARATOR . self::$cache_folder;
    }

    protected static function get_cache_string($request_data) {
        if ($request_data instanceof \WP_REST_Request) {
            $cache_string = md5(serialize($request_data->get_params()));
        } else {
            $cache_string = md5(serialize($request_data));
        }

        return $cache_string;
    }

    /**
     * Request file system credentials
     * @return bool false on failure, true on success.
     */
    public static function get_file_system_credentials() {

        require_once ABSPATH . 'wp-admin/includes/file.php';

        ob_start();
        $credentials = request_filesystem_credentials('/');
        ob_end_clean();

        return WP_Filesystem($credentials);
    }

    /**
     * Get file system credentials and return the $wp_filesystem;
     * @global Object $wp_filesystem
     * @return Object the $wp_filesystem object
     */
    public static function get_file_system() {

        global $wp_filesystem;

        if (!$wp_filesystem) {
            self::get_file_system_credentials();
        }

        return $wp_filesystem;
    }

    public static function get_cache($request_data, $force_get = false) {

        if (false === $force_get && !self::do_cache()) {
            return false;
        }

        $cache_string         = self::get_cache_string($request_data);
        $fs                   = self::get_file_system();
        $folder               = self::get_cache_folder();
        $fullpath             = $folder . $cache_string;

        $fs instanceof \WP_Filesystem_Base;

        if ($fs->exists($fullpath)) {
            $data       = $fs->get_contents($fullpath);
            $data_array = explode('<<<STECCACHESEPARATOR>>>', $data);
            $expire_on  = (int) $data_array[0];

            if (time() > $expire_on) {
                return false;
            } else {
                return maybe_unserialize($data_array[1]);
            }
        }

        return false;
    }

    public static function set_cache($request_data, $content, $expire = 86400, $force_set = false) {

        if (false === $force_set && !self::do_cache()) {
            return false;
        }

        $cache_string         = self::get_cache_string($request_data);
        $fs                   = self::get_file_system();
        $folder               = self::get_cache_folder();
        $fullpath             = $folder . $cache_string;
        $expire_on            = time() + $expire;

        if (!$fs->is_dir($folder)) {
            $fs->mkdir($folder);
        }

        if (false === $fs->put_contents($fullpath, $expire_on . '<<<STECCACHESEPARATOR>>>' . maybe_serialize($content), FS_CHMOD_FILE)) {

            if (is_wp_error($fs->errors) && $fs->errors->get_error_code()) {
                throw new Stec_Exception($fs->errors->get_error_message());
            }

            throw new Stec_Exception(esc_html__('Unexpected error', 'stec'));
        }
    }

    public static function purge() {

        $fs                   = self::get_file_system();
        $files                = glob(self::get_cache_folder() . '*');

        foreach ($files as $file) {
            if ($fs->exists($file)) {
                $fs->delete($file);
            }
        }

        return true;
    }
}

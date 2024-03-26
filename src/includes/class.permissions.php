<?php

namespace Stachethemes\Steclite;

if (!defined('ABSPATH')) {
    exit;
};

/**
 * Permission class 
 * This class is used to determine whether the user has access to certain calendar features such as
 * operate with taxonomies, events, settings etc...
 */
class Permissions {

    private static $is_super_admin = false;

    /**
     * The available stec posts
     */
    private static $posts_list = array('stec_event');

    /**
     * The available stec taxonomies
     */
    private static $taxonomies_list = array('stec_cal', 'stec_cat', 'stec_org', 'stec_loc', 'stec_gst');

    public static function init() {

        add_action('init', function () {

            Permissions::$is_super_admin = is_super_admin();

            apply_filters('stec_is_super_admin', Permissions::$is_super_admin);
        }, 5);

        add_filter('user_has_cap', array(__CLASS__, 'add_capabilities'), 5);
        add_action('rest_api_init', array(__CLASS__, 'register_rest_endpoints'));
    }

    public static function get_is_super() {
        return self::$is_super_admin;
    }

    public static function register_rest_endpoints() {

        register_rest_route('stec/v5', '/permissions', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_rest_permissions_list'),
            'permission_callback' => '__return_true',
        ));
    }

    /**
     * Register global user capabilities in order to operate with the calendar taxonomies and posts
     * NOTE:: some post types may add their own filters overriding these such as stec_event
     */
    public static function add_capabilities($capabilities) {

        $user_id = get_current_user_id();

        $capabilities["stec_public"] = true;

        if ($user_id) {
            $capabilities["stec_logged_in"] = true;
        }

        $can_manage_events   = self::current_user_can_manage_events($capabilities);
        $can_manage_settings = self::current_user_can_manage_settings($capabilities);
        $can_upload_images   = (bool) $user_id;

        foreach (self::$taxonomies_list as $taxonomy) {
            $capabilities["read_{$taxonomy}"]   = apply_filters("read_{$taxonomy}", 1, $user_id);
            $capabilities["manage_{$taxonomy}"] = apply_filters(
                "manage_{$taxonomy}",
                self::current_user_can_manage_terms($capabilities, $taxonomy),
                $user_id
            );
            $capabilities["assign_{$taxonomy}"] = apply_filters("assign_{$taxonomy}", 1, $user_id);
        }

        $capabilities["read_stec_event"]   = apply_filters("read_stec_event", 1, $user_id);
        $capabilities["manage_stec_event"] = apply_filters("manage_stec_event", $can_manage_events, $user_id);

        $capabilities['stec_access_dashboard']  = self::current_user_can_access_dashboard($capabilities);
        $capabilities['manage_stec_settings']   = $can_manage_settings;
        $capabilities['stec_upload_images']     = $can_upload_images;
        $capabilities['stec_verify_persons']    = apply_filters('stec_verify_persons', self::$is_super_admin);

        return $capabilities;
    }

    private static function current_user_can_manage_settings($capabilities) {

        if (self::$is_super_admin) {
            return 1;
        }

        if (false === is_user_logged_in()) {
            return 0;
        }

        $required_roles = Settings::get('dashboard', 'manage_settings');

        foreach ($required_roles as $role) {

            if (isset($capabilities[$role]) && true === $capabilities[$role]) {
                return 1;
            }
        }

        return 0;
    }

    private static function current_user_can_access_dashboard($capabilities) {

        if (self::$is_super_admin) {
            return 1;
        }

        $required_roles = Settings::get('dashboard', 'access');

        foreach ($required_roles as $role) {

            if (isset($capabilities[$role]) && true === $capabilities[$role]) {
                return 1;
            }
        }

        return 0;
    }

    private static function current_user_can_manage_terms($capabilities, $taxonomy) {

        if (self::$is_super_admin) {
            return 1;
        }

        $valid_taxonomies = array('stec_cal', 'stec_cat', 'stec_loc', 'stec_org', 'stec_gst');

        if (false === in_array($taxonomy, $valid_taxonomies)) {
            return 0;
        }

        $required_roles = Settings::get('dashboard', 'manage_' . $taxonomy);

        foreach ($required_roles as $role) {

            if (isset($capabilities[$role]) && true === $capabilities[$role]) {
                return 1;
            }
        }

        return 0;
    }

    private static function current_user_can_manage_events($capabilities) {

        if (self::$is_super_admin) {
            return 1;
        }

        $required_roles = Settings::get('dashboard', 'manage_events');

        foreach ($required_roles as $role) {

            if (isset($capabilities[$role]) && true === $capabilities[$role]) {
                return 1;
            }
        }

        return 0;
    }

    /**
     * Used for get_permissions_list
     * @see get_permissions_list();
     */
    private static function get_roles_list() {

        require_once(ABSPATH . '/wp-admin/includes/user.php');

        $roles = wp_roles()->roles;
        $roles = array_reverse($roles);
        $arr   = array();

        foreach ($roles as $role => $details) {
            $name = translate_user_role($details['name']);

            $arr[] = array(
                'label' => $name,
                'value' => $role,
            );
        }

        return apply_filters('stec_roles_list', $arr);
    }

    /**
     * REST Get available user permissions list
     * @return array Array list with permissions divided into label and value keys
     */
    public static function get_rest_permissions_list() {
        $permissions = self::get_permissions_list();

        $response = rest_ensure_response($permissions);

        $response->set_status(200);

        return $response;
    }

    /**
     * Get available user permissions list
     * @return array Array list with permissions divided into label and value keys
     */
    public static function get_permissions_list() {

        $wp_roles = self::get_roles_list();

        $stec_permissions = array(

            array(
                'label' => esc_html__('Public', 'stachethemes_event_calendar_lite'),
                'value' => 'stec_public',
            ),

            array(
                'label' => esc_html__('Private', 'stachethemes_event_calendar_lite'),
                'value' => 'stec_private',
            ),

            array(
                'label' => esc_html__('Logged-in users', 'stachethemes_event_calendar_lite'),
                'value' => 'stec_logged_in',
            ),
        );

        $list = array_merge($stec_permissions, $wp_roles);

        return apply_filters('stec_permissions_list', $list);
    }

    /**
     * Returns list with user permission lists
     * @param bool|null $userid The userid. If null it will use the current user id.
     * @return array List of user permissions
     */
    public static function get_user_permissions_list($userid = null) {

        if (null === $userid || false === filter_var($userid, FILTER_VALIDATE_INT, array('options' => array('min_range' => 1)))) {
            $userid = get_current_user_id();
        }

        $user_info    = get_userdata($userid);
        $user_roles   = isset($user_info->roles) ? $user_info->roles : array();
        $user_roles[] = 'stec_public';

        if (is_user_logged_in() || $user_info instanceof \WP_User) {
            $user_roles[] = 'stec_logged_in';
            $user_roles[] = sprintf('stec_user_%d', $userid);
        }

        return apply_filters('stec_user_permissions_list', $user_roles, $userid);
    }

    /**
     * Check if current user has certain permission to handle terms
     * 
     * @param integer|\WP_Term $term the Term ID or object
     * @param string $taxonomy_name The taxonomy name
     * @param string $permission_type The permission type. Allowed types are 'read_permission','use_permission','edit_permission' 
     * @return bool true|false
     */
    public static function current_user_has_term_permission($term, $taxonomy_name, $permission_type) {

        // Check if taxonomy_name is stec taxonomy
        if (false === in_array($taxonomy_name, self::$taxonomies_list)) {
            return false;
        }

        if (self::$is_super_admin) {
            return true;
        }

        if (false === $term instanceof \WP_Term) {

            if (!is_numeric($term) || $term <= 0) {
                return false;
            }

            $term = get_term($term, $taxonomy_name);

            if (is_wp_error($term)) {
                return false;
            }
        }

        switch ($permission_type) {
            case 'read_permission':

                if (false === current_user_can('read_' . $taxonomy_name)) {
                    return false;
                }

                break;

            case 'use_permission':

                if (false === current_user_can('assign_' . $taxonomy_name)) {
                    return false;
                }

                break;

            case 'edit_permission':

                if (false === current_user_can('manage_' . $taxonomy_name)) {
                    return false;
                }

                break;

            default:
                return false;
        }


        if (false === in_array($term->taxonomy, self::$taxonomies_list)) {
            return false;
        }

        if ($taxonomy_name && $term->taxonomy !== $taxonomy_name) {
            return false;
        }

        $user_permissions = self::get_user_permissions_list();
        $permissions      = get_term_meta($term->term_id, $permission_type);

        // If private permissions are enforced then add only stec_private to the list
        if (Helpers::is_enforce_private_permission($permission_type)) {
            $permissions = array('stec_private');
        }

        $permissions = array_map(function ($perm) use ($term) {

            // Note:
            // If stec_private is present convert it to stec_user_{userid} 
            // since user permission list contains this value if the user is logged in
            // So there's no need to check author meta and just check it with array_intersect
            if ('stec_private' === $perm) {
                $term_author = get_term_meta($term->term_id, 'author', true);
                $perm        = sprintf('stec_user_%d', $term_author);
            }

            return $perm;
        }, $permissions);

        return (bool) array_intersect($user_permissions, $permissions);
    }

    /**
     * Check if current user has certain permission to handle posts
     * 
     * @param integer|\WP_Post $post the post ID or object
     * @param string $post_type The post type name
     * @param string $permission_type The permission type. Allowed types are 'read_permission', 'edit_permission' 
     * @return bool true|false
     */
    public static function current_user_has_post_permission($post, $post_type, $permission_type) {

        // Check if post type is stec post
        if (false === in_array($post_type, self::$posts_list)) {
            return false;
        }

        // Supers can do everything
        if (self::$is_super_admin) {
            return true;
        }

        if (false === $post instanceof \WP_Post) {

            if (false === is_numeric($post) || $post <= 0) {
                return false;
            }

            if (get_post_type($post) !== $post_type) {
                return false;
            }

            $post = get_post($post);

            if (is_wp_error($post)) {
                return false;
            }
        }

        $current_user = get_current_user_id();

        // Allow super (e.g. calendar author) to view/approve/edit events submitted in their calendar
        if ($current_user > 0) {
            $super   = (int) get_post_meta($post->ID, 'super', true);

            if ($super === $current_user) {
                return true;
            }
        }

        switch ($permission_type) {

            case 'read_permission':

                if (false === current_user_can('read_' . $post_type)) {
                    return false;
                }

                break;

            case 'edit_permission':

                if (false === current_user_can('manage_' . $post_type)) {
                    return false;
                }

                break;

            default:

                return false;
        }

        $user_permissions = self::get_user_permissions_list();
        $permissions      = get_post_meta($post->ID, $permission_type);

        // If private permissions are enforced then add only stec_private to the list
        if (Helpers::is_enforce_private_permission($permission_type)) {
            $permissions = array('stec_private');
        }

        $permissions = array_map(function ($perm) use ($post) {

            // Note:
            // If stec_private is present convert it to stec_user_{userid} 
            // since user permission list contains this value if the user is logged in
            // So there's no need to check author meta and just check it with array_intersect
            if ('stec_private' === $perm) {
                $post_author = get_post_meta($post->ID, 'author', true);
                $perm        = sprintf('stec_user_%d', $post_author);
            }

            return $perm;
        }, $permissions);

        return (bool) array_intersect($user_permissions, $permissions);
    }

    public static function user_exists($user_id) {

        if (false === filter_var($user_id, FILTER_VALIDATE_INT)) {
            return false;
        }

        return (bool) get_users(['include' => $user_id, 'fields' => 'ID']);
    }

    /**
     * Check if user has certain permission to handle terms
     * 
     * @param integer $user_id the id of the user
     * @param integer|\WP_Term $term the Term ID or object
     * @param string $taxonomy_name The taxonomy name
     * @param string $permission_type The permission type. Allowed types are 'read_permission','use_permission','edit_permission' 
     * @return bool true|false
     */
    public static function user_has_term_permission($user_id, $term, $taxonomy_name, $permission_type) {

        // Check if taxonomy_name is stec taxonomy
        if (false === in_array($taxonomy_name, self::$taxonomies_list)) {
            return false;
        }

        if (false === self::user_exists($user_id)) {
            return false;
        }

        if (0 !== (int) $user_id && is_super_admin($user_id)) {
            return true;
        }

        switch ($permission_type) {
            case 'read_permission':

                if (false === user_can($user_id, 'read_' . $taxonomy_name)) {
                    return false;
                }

                break;

            case 'use_permission':

                if (false === user_can($user_id, 'assign_' . $taxonomy_name)) {
                    return false;
                }

                break;

            case 'edit_permission':

                if (false === user_can($user_id, 'manage_' . $taxonomy_name)) {
                    return false;
                }

                break;

            default:

                return false;
        }

        if (false === $term instanceof \WP_Term) {

            if (!is_numeric($term) || $term <= 0) {
                return false;
            }

            $term = get_term($term, $taxonomy_name);
        }

        if (is_wp_error($term)) {
            return false;
        }

        if (false === in_array($term->taxonomy, self::$taxonomies_list)) {
            return false;
        }

        if ($taxonomy_name && $term->taxonomy !== $taxonomy_name) {
            return false;
        }

        $user_permissions = self::get_user_permissions_list($user_id);
        $permissions      = get_term_meta($term->term_id, $permission_type);

        $permissions = array_map(function ($perm) use ($term) {

            // Note:
            // If stec_private is present convert it to stec_user_{userid} 
            // since user permission list contains this value if the user is logged in
            // So there's no need to check author meta and just check it with array_intersect
            if ('stec_private' === $perm) {
                $term_author = get_term_meta($term->term_id, 'author', true);
                $perm        = sprintf('stec_user_%d', $term_author);
            }

            return $perm;
        }, $permissions);

        return (bool) array_intersect($user_permissions, $permissions);
    }

    /**
     * Check if user has certain permission to handle posts
     * 
     * @param integer $user_id the id of the user
     * @param integer|\WP_Post $post the post ID or object
     * @param string $post_type The post type name
     * @param string $permission_type The permission type. Allowed types are 'read_permission', 'edit_permission' 
     * @return bool true|false
     */
    public static function user_has_post_permission($user_id, $post, $post_type, $permission_type) {

        // Check if post type is stec post
        if (false === in_array($post_type, self::$posts_list)) {
            return false;
        }

        if (false === self::user_exists($user_id)) {
            return false;
        }

        // Supers can do everything
        if (0 !== (int) $user_id && is_super_admin($user_id)) {
            return true;
        }

        // Allow super (e.g. calendar author) to view/approve/edit events submitted in their calendar
        $post_id = !is_numeric($post) ? $post->ID : $post;
        $super   = (int) get_post_meta($post_id, 'super', true);

        if ($super === $user_id) {
            return true;
        }

        switch ($permission_type) {

            case 'read_permission':

                if (false === user_can($user_id, 'read_' . $post_type)) {
                    return false;
                }

                break;

            case 'edit_permission':

                if (false === user_can($user_id, 'manage_' . $post_type)) {
                    return false;
                }

                break;

            default:

                return false;
        }

        if (false === $post instanceof \WP_Post) {

            if (!is_numeric($post) || $post <= 0) {
                return false;
            }

            $post = get_post($post); // get_post($post_id)

        }

        if (is_wp_error($post)) {
            return false;
        }

        $user_permissions = self::get_user_permissions_list($user_id);
        $permissions      = get_post_meta($post->ID, $permission_type);

        $permissions = array_map(function ($perm) use ($post) {

            // Note:
            // If stec_private is present convert it to stec_user_{userid} 
            // since user permission list contains this value if the user is logged in
            // So there's no need to check author meta and just check it with array_intersect
            if ('stec_private' === $perm) {
                $post_author = get_post_meta($post->ID, 'author', true);
                $perm        = sprintf('stec_user_%d', $post_author);
            }

            return $perm;
        }, $permissions);

        return (bool) array_intersect($user_permissions, $permissions);
    }
}

Permissions::init();

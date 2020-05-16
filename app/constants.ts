import { Platform } from 'react-native';


// Platform OS helpers
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

// All routes used by react-navigation
export const ROUTE_NAMES = {
    ROOT: 'Root',
    HOME: 'Home',
    TOUR: 'Tour',
    TOUR_MAP: 'TourMap',
    MODAL: 'Modal',
    MAIN: 'Main',
    LOGIN: 'Login',
    SIGNUP: 'Signup',
    AUTH: 'Auth',
    AUTH_LOADING: 'AuthLoading',
    PERMISSIONS_LOADING: 'PermissionsLoading',
} as const;

export type ROUTE_NAME = typeof ROUTE_NAMES[keyof typeof ROUTE_NAMES];

// All keys stored in system storage
export const STORAGE_KEYS = {
    USER_TOKEN: '@tour:userToken',
} as const;

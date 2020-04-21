import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';


import { ROUTE_NAMES } from './constants';
import Tour from './components/tours/Tour';
import Tours from './components/tours/Tours';
import Modal from './components/common/Modal';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AuthLoading from './components/auth/AuthLoading';
import NavHeader from './components/common/NavHeader';
import TourMap from './components/tours/TourMap';
import PermissionsLoading from './components/permissions/PermissionsLoading';


/**
 * Stack-navigate between tour list and tour detail views.
 */
const TourNavigator = createStackNavigator(
    {
        [ROUTE_NAMES.HOME]: Tours,
        [ROUTE_NAMES.TOUR]: Tour,
        [ROUTE_NAMES.TOUR_MAP]: TourMap,
    },
    {
        initialRouteName: ROUTE_NAMES.HOME,
        defaultNavigationOptions: {
            header: NavHeader,
        },
    },
);


/**
 * Tab-navigate between login and signup views.
 */
const AuthNavigator = createBottomTabNavigator({
    [ROUTE_NAMES.LOGIN]: Login,
    [ROUTE_NAMES.SIGNUP]: Signup,
});


/**
 * Stack-navigate between the tour views and the special modal view.
 */
const TourNavigatorWithModal = createStackNavigator(
    {
        [ROUTE_NAMES.MAIN]: TourNavigator,
        [ROUTE_NAMES.MODAL]: Modal,
    },
    {
        initialRouteName: ROUTE_NAMES.MAIN,
        mode: 'modal',
        headerMode: 'none',
    },
);


/**
 * Outermost switch navigator, wrapping the entire app.
 */
const AppNavigator = createAnimatedSwitchNavigator(
    {
        [ROUTE_NAMES.PERMISSIONS_LOADING]: PermissionsLoading,
        [ROUTE_NAMES.AUTH_LOADING]: AuthLoading,
        [ROUTE_NAMES.ROOT]: TourNavigatorWithModal,
        [ROUTE_NAMES.AUTH]: AuthNavigator,
    },
    { initialRouteName: ROUTE_NAMES.PERMISSIONS_LOADING },
);

export default AppNavigator;

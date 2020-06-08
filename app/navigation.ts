import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import { ROUTE_NAMES } from './constants';
import TourPreview from './components/tours/TourPreview';
import Tours from './components/tours/Tours';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AuthLoading from './components/auth/AuthLoading';
import NavHeader from './components/common/NavHeader';
import Tour from './components/tours/Tour';
import PermissionsLoading from './components/permissions/PermissionsLoading';
import ModalTourComplete from './components/tours/ModalTourComplete';


/**
 * Stack-navigate between tour list and tour detail views.
 */
const TourNavigator = createStackNavigator(
    {
        [ROUTE_NAMES.HOME]: Tours,
        [ROUTE_NAMES.TOUR_PREVIEW]: TourPreview,
        [ROUTE_NAMES.TOUR]: Tour,
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
        [ROUTE_NAMES.MODAL_TOUR_COMPLETE]: ModalTourComplete,
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

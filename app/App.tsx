import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import Tour from './components/tours/Tour';
import TourList from './components/tours/TourList';
import Modal from './components/common/Modal';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AuthLoading from './components/auth/AuthLoading';
import { ROUTE_NAMES } from './constants';
import { ReactNavFC } from './types';


// primary routes used in the app, excepting modals and authentication
const MainStack = createStackNavigator(
  {
    [ROUTE_NAMES.HOME]: TourList,
    [ROUTE_NAMES.TOUR]: Tour,
  },
  { initialRouteName: ROUTE_NAMES.HOME },
);

// authentication routes for login and signup
const AuthNavigator = createBottomTabNavigator({
  [ROUTE_NAMES.LOGIN]: Login,
  [ROUTE_NAMES.SIGNUP]: Signup,
});

// stack including all routes except authentication
const RootStack = createStackNavigator(
  {
    [ROUTE_NAMES.MAIN]: MainStack,
    [ROUTE_NAMES.MODAL]: Modal,
  },
  {
    mode: 'modal',
    headerMode: 'none',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

const AuthSwitch = createSwitchNavigator(
  {
    [ROUTE_NAMES.AUTH_LOADING]: AuthLoading,
    [ROUTE_NAMES.ROOT]: RootStack,
    [ROUTE_NAMES.AUTH]: AuthNavigator,
  },
  {
    initialRouteName: ROUTE_NAMES.AUTH_LOADING,
  }
);

const AppContainer = createAppContainer(AuthSwitch);


const App: ReactNavFC = () => {
  return <AppContainer />;
}
export default App;

import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import { Container } from 'native-base';


import { ROUTE_NAMES } from './constants';
import { ReactNavFC } from './types';
import Tour from './components/tours/Tour';
import TourList from './components/tours/TourList';
import Modal from './components/common/Modal';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AuthLoading from './components/auth/AuthLoading';
import AppLoading from './components/common/AppLoading';
import NavHeader from './components/common/NavHeader';


// primary routes used in the app, excepting modals and authentication
const MainStack = createStackNavigator(
  {
    [ROUTE_NAMES.HOME]: TourList,
    [ROUTE_NAMES.TOUR]: Tour,
  },
  {
    initialRouteName: ROUTE_NAMES.HOME,
    defaultNavigationOptions: {
      header: NavHeader,
    },
  },
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
    initialRouteName: ROUTE_NAMES.MAIN,
    mode: 'modal',
    headerMode: 'none',
  }
);

// outermost wrapper including authentication screens
const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      [ROUTE_NAMES.AUTH_LOADING]: AuthLoading,
      [ROUTE_NAMES.ROOT]: RootStack,
      [ROUTE_NAMES.AUTH]: AuthNavigator,
    },
    { initialRouteName: ROUTE_NAMES.AUTH_LOADING },
  )
);


/**
 * Main app. Displays AppLoading view until all assets are loaded.
 */
const App: ReactNavFC = () => {
  const [assetsDidLoad, setAssetsDidLoad] = useState(false);
  useEffect(() => { loadAssetsAsync(setAssetsDidLoad) }, [assetsDidLoad]);
  if (!assetsDidLoad) {
    return <AppLoading />;
  }
  return (
    <Container>
      <AppContainer />
    </Container>
  );
}
export default App;


/**
 * Load assets async, then toggle `isReady` state when finished.
 */
async function loadAssetsAsync(setAssetsDidLoad: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {
  // TODO: remove unnecessary delay when loading screen is finished
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => { resolve() }, 1000);
  });
  await Font.loadAsync({
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    ...Ionicons.font,
  });
  setAssetsDidLoad(true);
}

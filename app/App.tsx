import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Tour from './components/tours/Tour';
import TourList from './components/tours/TourList';
import Modal from './components/common/modal';
import { ROUTE_NAMES } from './constants';
import { ReactNavFC } from './types';


const MainStack = createStackNavigator(
  {
    [ROUTE_NAMES.HOME]: TourList,
    [ROUTE_NAMES.TOUR]: Tour,
  },
  { initialRouteName: ROUTE_NAMES.HOME },
);

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

const AppContainer = createAppContainer(RootStack);


const App: ReactNavFC = () => {
  return <AppContainer />;
}
export default App;

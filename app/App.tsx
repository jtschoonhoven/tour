import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Tour from './components/tours/Tour';
import TourList from './components/tours/TourList';
import { ROUTE_NAMES } from './constants';


const AppNavigator = createStackNavigator(
  {
      [ROUTE_NAMES.HOME]: TourList,
      [ROUTE_NAMES.TOUR]: Tour,
  },
  {
      initialRouteName: ROUTE_NAMES.HOME,
  }
);
const Home = createAppContainer(AppNavigator);


export default function App() {
  return <Home />;
}

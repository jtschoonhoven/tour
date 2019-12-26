import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { createAppContainer } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Container } from 'native-base';


import { ReactNavFC } from './types';
import AppLoading from './components/common/AppLoading';
import AppNavigator from './navigation';


const AppContainer = createAppContainer(AppNavigator);

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

import React from 'react';
import { useFonts } from '@use-expo/font';
import { createAppContainer } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Container } from 'native-base';
import { Provider } from 'react-redux';

import AppLoading from './components/common/AppLoading';
import AppNavigator from './navigation';
import store from './store';
import { ReactNavFC } from './types';


const AppContainer = createAppContainer(AppNavigator);


/**
 * Main app. Displays AppLoading view until all assets are loaded.
 */
const App: ReactNavFC = () => {
    const [fontsDidLoad] = useFonts({
        Roboto: require('native-base/Fonts/Roboto.ttf'), // eslint-disable-line global-require
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'), // eslint-disable-line global-require
        ...Ionicons.font,
    });

    if (!fontsDidLoad) {
        return <AppLoading />;
    }

    return (
        <Container>
            <Provider store={ store }>
                <AppContainer />
            </Provider>
        </Container>
    );
};
export default App;

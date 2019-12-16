import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';

import { ReactNavFC, ReactNavProp } from '../../types';
import { ROUTE_NAMES, STORAGE_KEYS } from '../../constants';


/**
 * Show this loading screen while fetching authentication state from a persistent storage.
 */
const AuthLoading: ReactNavFC = ({ navigation }) => {
    useEffect(() => { getToken(navigation) });
    return (
        <View>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
      </View>
    );
};
export default AuthLoading;


/**
 * Async fetch the userToken from system storage and navigate to the homepage on success.
 */
async function getToken(navigation: ReactNavProp): Promise<void> {
    const userToken = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);

    // This will switch to the Home screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    navigation.navigate(userToken ? ROUTE_NAMES.HOME : ROUTE_NAMES.AUTH);
}

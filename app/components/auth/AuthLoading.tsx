import React, { useEffect } from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';

import { ReactNavFC, ReactNavProp } from '../../types';
import { ROUTE_NAMES, STORAGE_KEYS } from '../../constants';


/**
 * Async fetch the userToken from system storage and navigate to the homepage on success.
 */
async function getToken(navigation: ReactNavProp): Promise<void> {
    let userToken;
    try {
        userToken = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    }
    catch (error) {
        // TODO: show alert
        console.error(error);
        throw error;
    }
    // TODO: validate token before redirecting to homescreen

    // This will switch to the Home screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    navigation.navigate(userToken ? ROUTE_NAMES.HOME : ROUTE_NAMES.AUTH);
}


/**
 * Show this loading screen while fetching authentication state from a persistent storage.
 * If the user does not have a valid auth token they will be asked to log in.
 */
const AuthLoading: ReactNavFC = ({ navigation }) => {
    useEffect((): void => { getToken(navigation); });
    return (
        <View>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </View>
    );
};
export default AuthLoading;

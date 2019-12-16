import React from 'react';
import * as Google from 'expo-google-app-auth';
import { AsyncStorage, Button } from 'react-native';

import { ROUTE_NAMES, STORAGE_KEYS } from '../../constants';
import { ReactNavProp, ReactNavFC } from '../../types';


const GOOGLE_AUTH_CONFIG = {
    clientId: 'unused-but-required',
    iosClientId: '269918202494-8e7ip5ui7m21f9j6mon4dfk191r5fesm.apps.googleusercontent.com',
    androidClientId: '269918202494-oeke4ub4hrv6orsg29n1qbdv6ec9m9ne.apps.googleusercontent.com',
    // iosStandaloneAppClientId: `<YOUR_IOS_CLIENT_ID>`,
    // androidStandaloneAppClientId: `<YOUR_ANDROID_CLIENT_ID>`,
    scopes: ['profile', 'email'],
};


const LoginWithGoogleBtn: ReactNavFC = ({ navigation }) => {
    return (
        <Button title="Login with Google" onPress={ () => loginWithGoogleAsync(navigation) } />
    );
};
export default LoginWithGoogleBtn;


/**
 * Redirect to Google login page and redirect on success.
 *
 * loginResult.user = {
 *   "email": "jtschoonhoven@gmail.com",
 *   "familyName": "Schoonhoven",
 *   "givenName": "Jonathan",
 *   "id": "102046546186394019356",
 *   "name": "Jonathan Schoonhoven",
 *   "photoUrl": "https://lh3.googleusercontent.com/a-/AAuE7mDG2jWYt1jJCLjMULdpG1Nrw-Oj9DjvRetQ_3m2PQ",
 * }
 */
async function loginWithGoogleAsync(navigation: ReactNavProp): Promise<void> {
    let loginResult;
    try {
        loginResult = await Google.logInAsync(GOOGLE_AUTH_CONFIG);
    }
    catch (error) {
        // TODO: show alert
        throw error;
    }
    if (loginResult.type === 'cancel') {
        // TODO: show alert and retry rather than throw error
        throw new Error('Login failed');
    }
    const { accessToken } = loginResult;
    try {
        AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, accessToken);
    }
    catch (error) {
        // TODO: show alert
        throw error;
    }
    // navigate home on success
    navigation.navigate(ROUTE_NAMES.HOME);
}

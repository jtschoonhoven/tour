import React from 'react';
import { AsyncStorage, Button, Text, View } from 'react-native';

import LoginWithGoogleBtn from './LoginWithGoogleBtn';
import { ReactNavFC, ReactNavProp } from '../../types';
import { ROUTE_NAMES, STORAGE_KEYS } from '../../constants';


async function login(navigation: ReactNavProp): Promise<void> {
    // TODO: login with a backend persistent store
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, 'TODO');
    }
    catch (error) {
        // TODO: show alert
        console.error(error);
        throw error;
    }
    navigation.navigate(ROUTE_NAMES.HOME);
}


const Login: ReactNavFC = ({ navigation }) => {
    return (
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
            <Text>Login</Text>
            <Button title="Login" onPress={ (): void => { login(navigation); } } />
            <LoginWithGoogleBtn navigation={ navigation } />
        </View>
    );
};
Login.navigationOptions = { title: 'Login' };
export default Login;

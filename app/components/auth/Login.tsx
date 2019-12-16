import React from 'react';
import { AsyncStorage, Button, Text, View } from 'react-native';

import { ReactNavFC, ReactNavProp } from '../../types';
import { ROUTE_NAMES, STORAGE_KEYS } from '../../constants';

const Login: ReactNavFC = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Login</Text>
            <Button title="Login" onPress={ () => { login(navigation) } }></Button>
        </View>
    );
};
Login.navigationOptions = { title: 'Login' };
export default Login;


async function login(navigation: ReactNavProp) {
    // TODO: login with a backend persistent store
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, 'TODO');
    }
    catch (error) {
        // TODO: show alert
        throw error;
    }
    navigation.navigate(ROUTE_NAMES.HOME)
}

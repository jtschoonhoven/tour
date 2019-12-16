import React from 'react';
import { Button, Text, View } from 'react-native';

import { ReactNavFC, ReactNavProp } from '../../types';
import { ROUTE_NAMES } from '../../constants';

const Login: ReactNavFC = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Login</Text>
            <Button title="Login" onPress={ () => { navigation.navigate(ROUTE_NAMES.HOME)} }></Button>
        </View>
    );
};
Login.navigationOptions = { title: 'Login' };
export default Login;

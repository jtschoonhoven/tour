import React from 'react';
import { Text, View } from 'react-native';

import { ReactNavFC } from '../../types';

const Signup: ReactNavFC = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Signup</Text>
        </View>
    );
};
Signup.navigationOptions = { title: 'Signup' };
export default Signup;

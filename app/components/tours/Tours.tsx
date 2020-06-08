import React from 'react';
import { AsyncStorage, View } from 'react-native';
import { Text, Button } from 'native-base';

import { ROUTE_NAMES, STORAGE_KEYS } from '../../constants';
import { ReactNavFC, ReactNavProp } from '../../types';
import TourList from './TourList';


async function logout(navigation: ReactNavProp): Promise<void> {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    }
    catch (error) {
        // TODO: show alert
        console.error(error);
        throw error;
    }
    navigation.navigate(ROUTE_NAMES.LOGIN);
}


/**
 * Top-level view, primarily for browsing tours.
 */
const Tours: ReactNavFC = ({ navigation }) => {
    return (
        <View style={ { flex: 1 } }>
            <TourList navigation={ navigation } />
            <Button onPress={ (): Promise<void> => logout(navigation) }>
                <Text>Logout</Text>
            </Button>
        </View>
    );
};
Tours.navigationOptions = { title: 'Tours' };
export default Tours;

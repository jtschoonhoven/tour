import React from 'react';
import { AsyncStorage, View } from 'react-native';
import { Text, Button } from 'native-base';

import { ROUTE_NAMES, STORAGE_KEYS } from '../../constants';
import { ReactNavFC, ReactNavProp } from '../../types';
import TourList from './TourList';
import { Tour } from './TourList';


// navigation params passed to Tour child components
export interface TourScreenProps {
    readonly tour: Tour;
}


/**
 * Top-level view, primarily for browsing tours.
 */
const Tours: ReactNavFC = ({ navigation }) => {
    const modal = { title: 'Example modal' };
    return (
        <View style={{ flex: 1 }}>
            <TourList navigation={ navigation } />
            <Button onPress={ () => navigation.navigate(ROUTE_NAMES.MODAL, { modal }) }>
                <Text>{ 'Launch example modal' }</Text>
            </Button>
            <Button onPress={ () => logout(navigation) }>
                <Text>{ 'Logout' }</Text>
            </Button>
        </View>
    );
}
Tours.navigationOptions = { title: 'Tours' };
export default Tours;


async function logout(navigation: ReactNavProp) {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    }
    catch (error) {
        // TODO: show alert
        throw error;
    }
    navigation.navigate(ROUTE_NAMES.LOGIN);
}
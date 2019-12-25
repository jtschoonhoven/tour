import React from 'react';
import { View, Text } from 'react-native';

import { TourScreenProps } from './Tours';
import { ReactNavFC, ReactNavProp } from '../../types';


const Tour: ReactNavFC<{}, TourScreenProps> = ({ navigation }) => {
    const title = getTourTitle(navigation);
    return (
        <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
            <Text>{ title }</Text>
        </View>
    );
};
Tour.navigationOptions = ({ navigation }) => {
    const title = getTourTitle(navigation);
    return { title };
}
export default Tour;


/**
 * Return a human-readable title for this tour.
 */
function getTourTitle(navigation: ReactNavProp<TourScreenProps>): string {
    const tour = navigation.getParam('tour');
    return `Tour Screen #${ tour.id }`;
}

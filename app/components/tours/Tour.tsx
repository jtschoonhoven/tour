import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { TourScreenProps } from './TourList';


interface Props {
    navigation: NavigationScreenProp<TourScreenProps>
}


const Tour: React.FC<Props> = ({ navigation }) => {
    const tour = navigation.getParam('tour');
    return (
        <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
            <Text>Tour Screen #{ tour.id }</Text>
        </View>
    );
};
export default Tour;

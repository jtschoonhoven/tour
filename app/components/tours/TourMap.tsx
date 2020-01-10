import React from 'react';
import MapView, { Circle } from 'react-native-maps';
import { StyleSheet } from 'react-native';

import { ReactNavFC } from '../../types';
import { TourScreenProps } from './Tours';


const STYLES = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});

const INITIAL_REGION = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const INITIAL_CIRCLE = {
    center: { latitude: 37.78825, longitude: -122.4324 },
    radius: 1000,
    stroke: StyleSheet.hairlineWidth,
};

const TourMap: ReactNavFC<{}, TourScreenProps> = ({ navigation }) => {
    const tour = navigation.getParam('tour');
    return (
        <MapView style={ STYLES.map } initialRegion={ INITIAL_REGION }>
            <Circle { ...INITIAL_CIRCLE } />
        </MapView>
    );
};
TourMap.navigationOptions = ({ navigation }) => {
    const tour = navigation.getParam('tour');
    return { title: tour.title };
};
export default TourMap;

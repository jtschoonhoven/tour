import React from 'react';
import MapView, { Circle } from 'react-native-maps';
import { StyleSheet } from 'react-native';

import { ReactNavFC } from '../../types';
import { TourScreenProps } from './Tours';
import locationService from '../../services/location-service';


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


const TourMap: ReactNavFC<{}, TourScreenProps> = ({ navigation }) => {
    const tour = navigation.getParam('tour');

    React.useEffect(() => {
        locationService.watchActiveCheckpoint(tour, 0);
    });

    const linkedGeometries = locationService.getLinkedGeometries(tour, 0);
    const linkedMapGeoCircleProps = linkedGeometries.map((geom) => {
        return {
            center: { latitude: geom.lat, longitude: geom.lng },
            radius: geom.radius,
            strokeWidth: StyleSheet.hairlineWidth,
        };
    });

    const linkedMapGeoCircles = linkedMapGeoCircleProps.map((geoCircleProps, idx) => {
        return <Circle { ...geoCircleProps } key={ idx.toString() } />;
    });

    return (
        <MapView style={ STYLES.map } initialRegion={ INITIAL_REGION }>
            { linkedMapGeoCircles }
        </MapView>
    );
};
TourMap.navigationOptions = ({ navigation }): { title: string } => {
    const tour = navigation.getParam('tour');
    return { title: tour.name };
};
export default TourMap;

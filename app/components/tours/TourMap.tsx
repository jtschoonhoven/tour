import React from 'react';
import MapView, { Circle, MapCircleProps } from 'react-native-maps';
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


const TourMap: ReactNavFC<{}, TourScreenProps> = ({ navigation }) => {
    const tour = navigation.getParam('tour');
    const { checkpoints } = tour;
    const firstCheckpoint = checkpoints.find(() => true);

    if (!firstCheckpoint) {
        throw new Error(`Tour ${tour.name} invalid: no checkpoints.`);
    }

    const linkedCheckpoints = firstCheckpoint.linkIndices.map((index) => {
        return tour.checkpoints[index];
    });

    const linkedMapGeoCircleProps = linkedCheckpoints.flatMap((checkpoint) => {
        return checkpoint.geometries.map((geom): MapCircleProps => {
            return {
                center: { latitude: geom.lat, longitude: geom.lng },
                radius: geom.radius,
                strokeWidth: StyleSheet.hairlineWidth,
            };
        });
    });

    const linkedMapGeoCircles = linkedMapGeoCircleProps.map((geoCircleProps, idx) => {
        return <Circle { ...geoCircleProps } key={ idx } />;
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

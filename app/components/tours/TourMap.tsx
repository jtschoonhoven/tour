import React from 'react';
import { connect } from 'react-redux';
import MapView, { Circle } from 'react-native-maps';
import { StyleSheet } from 'react-native';

import { ReactNavFC } from '../../types';
import { TourScreenProps } from './Tours';
import locationService from '../../services/location-service';
import { TourModel } from '../../store/tours-store';
import { AppState, actions } from '../../store';
import AppLoading from '../common/AppLoading';


const STYLES = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});


const INITIAL_REGION = {
    latitude: 37.76483,
    longitude: -122.4455,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};


interface StateProps {
    currentTourCheckpointIndex?: number;
    currentTourIsStarted: boolean;
    currentTourIndex?: number;
}

function mapStateToProps(state: AppState): StateProps {
    let currentTourCheckpointIndex: number | undefined;
    let currentTourIsStarted = false;
    let currentTourIndex: number | undefined;

    if (state.tours.currentTour) {
        currentTourCheckpointIndex = state.tours.currentTour.checkpointIndex;
        currentTourIsStarted = state.tours.currentTour.isStarted;
        currentTourIndex = state.tours.currentTour.toursIndex;
    }
    return {
        currentTourCheckpointIndex,
        currentTourIsStarted,
        currentTourIndex,
    };
}


const _Circles = (tour: TourModel, checkpointIndex?: number): JSX.Element[] => {
    if (checkpointIndex === undefined) {
        return [];
    }
    const linkedGeometries = locationService.getLinkedGeometries(tour, checkpointIndex);
    return linkedGeometries.map((geom, idx) => {
        const geoCircleProps = {
            center: { latitude: geom.lat, longitude: geom.lng },
            radius: geom.radius,
            strokeWidth: StyleSheet.hairlineWidth,
        };
        return <Circle { ...geoCircleProps } key={ idx.toString() } />;
    });
};


const TourMap: ReactNavFC<StateProps, TourScreenProps> = (props) => {
    const {
        navigation,
        currentTourCheckpointIndex,
        currentTourIsStarted,
        currentTourIndex,
    } = props;

    const tour = navigation.getParam('tour');

    const isTourStarted = !(
        currentTourIndex === undefined
        || !currentTourIsStarted
        || currentTourCheckpointIndex === undefined
        || currentTourIndex !== tour.index
    );

    React.useEffect(() => {
        if (!isTourStarted) {
            actions.tours.tourStart(tour.index);
        }
    }, [currentTourIndex, currentTourIsStarted, currentTourCheckpointIndex]);

    // watch geofences in background
    React.useEffect(() => {
        if (isTourStarted && currentTourCheckpointIndex !== undefined) {
            locationService.watchActiveCheckpoint(tour, currentTourCheckpointIndex);
        }
    }, [currentTourCheckpointIndex]);

    // place next checkpoints in map
    const linkedMapGeoCircles = React.useMemo<JSX.Element[]>(() => {
        return _Circles(tour, currentTourCheckpointIndex);
    }, [tour, currentTourCheckpointIndex]);

    // show loading screen until tour is activated in the state
    if (!isTourStarted || currentTourCheckpointIndex === undefined) {
        return <AppLoading />;
    }

    return (
        <MapView style={ STYLES.map } initialRegion={ INITIAL_REGION } showsUserLocation>
            { linkedMapGeoCircles }
        </MapView>
    );
};
TourMap.navigationOptions = ({ navigation }): { title: string } => {
    const tour = navigation.getParam('tour');
    return { title: tour.name };
};
export default connect(mapStateToProps)(TourMap);

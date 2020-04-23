import React from 'react';
import { connect } from 'react-redux';
import MapView, { Circle } from 'react-native-maps';
import { StyleSheet } from 'react-native';

import { ReactNavFC } from '../../types';
import { TourScreenProps } from './Tours';
import locationService from '../../services/location-service';
import { TourModel, TourMeta } from '../../store/tours-store';
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
    tourMeta?: TourMeta;
}

function mapStateToProps(state: AppState): StateProps {
    return {
        tourMeta: state.tours.currentTour,
    };
}


const _Circles = (tour: TourModel, checkpointIndex: number): JSX.Element[] => {
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


function _isTourStarted(tourMeta: TourMeta | undefined, tourIndex: number): boolean {
    return !!(tourMeta && tourMeta.isStarted && tourMeta.toursIndex === tourIndex);
}


const TourMap: ReactNavFC<StateProps, TourScreenProps> = ({ navigation, tourMeta }) => {
    const tour = navigation.getParam('tour');

    if (!_isTourStarted(tourMeta, tour.index) || !tourMeta) {
        actions.tours.tourStart(tour.index);
        return <AppLoading />;
    }

    // watch geofences in background
    React.useEffect(() => {
        locationService.watchActiveCheckpoint(tour, tourMeta.checkpointIndex);
    }, [tourMeta.checkpointIndex, tour]);

    // place next checkpoints in map
    const linkedMapGeoCircles = React.useMemo<JSX.Element[]>(() => {
        return _Circles(tour, tourMeta.checkpointIndex);
    }, [tour, tourMeta.checkpointIndex]);

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

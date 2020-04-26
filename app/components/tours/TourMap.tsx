import React from 'react';
import { connect } from 'react-redux';
import MapView, { Circle } from 'react-native-maps';
import { StyleSheet } from 'react-native';

import { ReactNavFC } from '../../types';
import locationService from '../../services/location-service';
import { TourModel } from '../../store/tours-store';
import { AppState } from '../../store/store';


const STYLES = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});


export interface TourMapNavParams {
    tourName: string;
}


const INITIAL_REGION = {
    latitude: 37.76483,
    longitude: -122.4455,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};


interface StateProps {
    activeTourCheckpointIndex?: number;
    activeTourIndex?: number;
    activeTour?: TourModel;
}

function mapStateToProps(state: AppState): StateProps {
    let activeTour: TourModel | undefined;
    const activeTourIndex = state.tours.currentTour?.toursIndex;

    if (typeof activeTourIndex !== 'undefined') {
        activeTour = state.tours.tours[activeTourIndex];
    }

    return {
        activeTour,
        activeTourIndex,
        activeTourCheckpointIndex: state.tours.currentTour?.checkpointIndex,
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


const TourMap: ReactNavFC<StateProps, TourMapNavParams> = (props) => {
    const { navigation, activeTourCheckpointIndex, activeTour, activeTourIndex } = props;
    const tourName = navigation.getParam('tourName');

    if (!activeTour) {
        throw new Error(`Tour ${tourName} at index ${activeTourIndex} is not active.`);
    }

    if (typeof activeTourCheckpointIndex === 'undefined') {
        throw new Error(`Tour ${tourName} is loaded but no checkpoint is active.`);
    }

    // watch geofences in background
    React.useEffect(() => {
        locationService.watchActiveCheckpoint(activeTour, activeTourCheckpointIndex);
    }, [activeTourCheckpointIndex]);

    // place next checkpoints in map
    const linkedMapGeoCircles = React.useMemo<JSX.Element[]>(() => {
        return _Circles(activeTour, activeTourCheckpointIndex);
    }, [activeTour, activeTourCheckpointIndex]);

    return (
        <MapView style={ STYLES.map } initialRegion={ INITIAL_REGION } showsUserLocation>
            { linkedMapGeoCircles }
        </MapView>
    );
};
TourMap.navigationOptions = ({ navigation }): { title: string } => {
    const tourName = navigation.getParam('tourName');
    return { title: tourName };
};
export default connect(mapStateToProps)(TourMap);

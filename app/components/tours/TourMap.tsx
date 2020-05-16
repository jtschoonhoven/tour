import React from 'react';
import MapView, { Circle, Region, EdgePadding, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

import actions from '../../store/actions';
import locationService from '../../services/location-service';
import navigationService from '../../services/navigation-service';
import { ReactNavFC } from '../../types';
import { TourModel } from '../../store/tours-store';
import { AppState } from '../../store/store';
import { ROUTE_NAMES } from '../../constants';


const STYLES = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});


export interface TourMapNavParams {
    tourName: string;
}


const DEFAULT_EDGE_PADDING: EdgePadding = {
    top: 200,
    right: 200,
    bottom: 200,
    left: 200,
};

const ANIMATION_DELAY_MS = 3000;

const DEFAULT_MAP_FIT_OPTS = {
    animated: true,
    edgePadding: DEFAULT_EDGE_PADDING,
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


/**
 * Return an array of Circle elements to render within the map.
 */
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


function _getInitialRegion(tour: TourModel, checkpointIndex: number): Region {
    let geoCircles = locationService.getLinkedGeometries(tour, checkpointIndex);
    if (!geoCircles.length) {
        geoCircles = locationService.getLinkedGeometries(tour, 0);
    }
    if (!geoCircles.length) {
        throw new Error(`Tour ${tour.name} has no geometries in first checkpoint.`);
    }
    const geoCircle = geoCircles[0];
    const { lat, lng } = geoCircle;
    return locationService.getRegion({ lat, lng });
}


/**
 * When the map is ready, fit all the checkpoints in the map view
 */
function _onMapReady(mapRef: React.RefObject<MapView>, tour: TourModel, checkpointIndex: number): void {
    const latLngs = locationService.getLinkedGeometriesLatLng(tour, checkpointIndex);
    mapRef.current?.fitToCoordinates(latLngs, DEFAULT_MAP_FIT_OPTS);
}


function _zoomMapToFrame(mapRef: React.RefObject<MapView>, linkedGeometriesLatLng: Array<LatLng>): () => void {
    let innerTimeoutId: NodeJS.Timeout;

    // Get the user's current coordinates
    const userCoordsPromise = Location.getCurrentPositionAsync(locationService.DEFAULT_LOCATION_OPTIONS)
        .catch((err) => {
            // Handle the expected error if location services are disabled
            if (err.code === 'E_LOCATION_SETTINGS_UNSATISFIED') {
                actions.location.setIsLocationServiceEnabled(false);
                actions.location.setIsLocationPermissionLoading(true);
                navigationService.navigate(ROUTE_NAMES.PERMISSIONS_LOADING);
                return;
            }
            // Do not handle an unanticipated error
            throw new Error(err);
        });

    // Wait for outer timeout then zoom to user location
    const outerTimeoutId = setTimeout(() => {
        userCoordsPromise.then((location) => {
            if (!location) {
                return;
            }
            const { latitude, longitude } = location.coords;
            mapRef.current?.fitToCoordinates([{ latitude, longitude }], DEFAULT_MAP_FIT_OPTS);

            // Wait for inner timeout then zoom to frame user with checkpoints
            innerTimeoutId = setTimeout(() => {
                mapRef.current?.fitToCoordinates(
                    [{ latitude, longitude }, ...linkedGeometriesLatLng],
                    DEFAULT_MAP_FIT_OPTS,
                );
            }, ANIMATION_DELAY_MS);
        });
    }, ANIMATION_DELAY_MS);

    return (): void => {
        clearTimeout(innerTimeoutId);
        clearTimeout(outerTimeoutId);
    };
}


const TourMap: ReactNavFC<StateProps, TourMapNavParams> = (props) => {
    const { navigation, activeTourCheckpointIndex, activeTour, activeTourIndex } = props;
    const tourName = navigation.getParam('tourName');
    const mapRef = React.createRef<MapView>();

    if (!activeTour) {
        throw new Error(`Tour ${tourName} at index ${activeTourIndex} is not active.`);
    }

    if (typeof activeTourCheckpointIndex === 'undefined') {
        throw new Error(`Tour ${tourName} is loaded but no checkpoint is active.`);
    }

    const linkedGeometriesLatLng = React.useMemo(() => {
        return locationService.getLinkedGeometriesLatLng(activeTour, activeTourCheckpointIndex);
    }, [activeTour.index, activeTourCheckpointIndex]);

    const initialRegion = React.useMemo(() => {
        return _getInitialRegion(activeTour, activeTourCheckpointIndex);
    }, [activeTour.index, activeTourCheckpointIndex]);

    // Watch geofences in background
    React.useEffect((): void => {
        locationService.watchActiveCheckpoint(activeTour, activeTourCheckpointIndex);
    }, [activeTour.index, activeTourCheckpointIndex]);

    React.useEffect(() => {
        return _zoomMapToFrame(mapRef, linkedGeometriesLatLng);
    }, [activeTour.index, activeTourCheckpointIndex]);

    // Place next checkpoints in map
    const linkedMapGeoCircles = React.useMemo<JSX.Element[]>(() => {
        return _Circles(activeTour, activeTourCheckpointIndex);
    }, [activeTour.index, activeTourCheckpointIndex]);

    return (
        <MapView
            ref={ mapRef }
            style={ STYLES.map }
            initialRegion={ initialRegion }
            showsPointsOfInterest={ false }
            showsTraffic={ false }
            showsIndoors={ false }
            toolbarEnabled={ false } // Android only. If false will hide 'Navigate' and 'Open in Maps' buttons on press
            loadingEnabled // If true a loading indicator will show while the map is loading.
            showsUserLocation
            onMapReady={ (): void => { _onMapReady(mapRef, activeTour, activeTourCheckpointIndex); } }
        >
            { linkedMapGeoCircles }
        </MapView>
    );
};
TourMap.navigationOptions = ({ navigation }): { title: string } => {
    const tourName = navigation.getParam('tourName');
    return { title: tourName };
};
export default connect(mapStateToProps)(TourMap);

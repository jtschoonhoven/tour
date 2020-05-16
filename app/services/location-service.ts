import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Dimensions } from 'react-native';
import { Region, LatLng } from 'react-native-maps';
import get from 'lodash/get';

import actions from '../store/actions';
import { TourModel, CheckpointModel, GeoCircle, RegionId } from '../store/tours-store';


const GEOFENCE_BACKGROUND_TASK_NAME = '__tour__';

const DEFAULT_LOCATION_OPTIONS: Location.LocationOptions = {
    accuracy: Location.Accuracy.Highest,
    mayShowUserSettingsDialog: true,
    maximumAge: 10000,
    timeout: 10000,
};


/**
 * Define system-level background tasks to monitor.
 * NOTE: MUST BE CALLED IN GLOBAL SCOPE ON APP LOAD.
 * https://docs.expo.io/versions/v37.0.0/sdk/task-manager/#taskmanagerdefinetasktaskname-task
 */
function defineBackgroundTasks(): void {
    TaskManager.defineTask(GEOFENCE_BACKGROUND_TASK_NAME, ({ data, error }) => {
        const eventType = get(data, 'eventType');
        const regionData = get(data, 'region');
        const regionIdentifier = get(regionData, 'identifier');
        const regionId = new RegionId(regionIdentifier);

        // throw on TaskManager error
        if (error) {
            throw new Error(error.message);
        }

        // throw on Regionid error
        if (regionId.error) {
            throw regionId.error;
        }

        // throw on unexpected event type
        if (eventType !== Location.GeofencingEventType.Enter) {
            throw new Error(`Unexpected event ID: ${eventType}`);
        }

        actions.tours.enterCheckpoint(regionId.asObject());
    });
}


/**
 * Return a list of checkpoints that are linked to from the current checkpoint index.
 */
function getLinkedCheckpoints(tour: TourModel, checkpointIndex: number): CheckpointModel[] {
    if (checkpointIndex >= tour.checkpoints.length) {
        throw new Error(`No checkpoint exists at index ${checkpointIndex} for tour ${tour.name}`);
    }
    const checkpoint = tour.checkpoints[checkpointIndex];
    return checkpoint.linkIndices.map((linkIndex): CheckpointModel => {
        if (linkIndex >= tour.checkpoints.length) {
            throw new Error(`No checkpoint exists at index ${linkIndex} for tour ${tour.name}`);
        }
        return tour.checkpoints[linkIndex];
    });
}


/**
 * Return a list of all geoCircles that are contained in any linked checkpoint.
 */
function getLinkedGeometries(tour: TourModel, checkpointIndex: number): GeoCircle[] {
    const linkedCheckpoints = getLinkedCheckpoints(tour, checkpointIndex);
    return linkedCheckpoints.flatMap((linkedCheckpoint) => linkedCheckpoint.geometries);
}


/**
 * Same as getLinkedGeometries but drops the `radius` property to return a list of LatLng objects.
 */
function getLinkedGeometriesLatLng(tour: TourModel, checkpointIndex: number): LatLng[] {
    const linkedGeometries = getLinkedGeometries(tour, checkpointIndex);
    return linkedGeometries.map((geom) => { return { latitude: geom.lat, longitude: geom.lng }; });
}


/**
 * Parse a CheckpointModel and return an array of LocationRegions for all linked geometries.
 */
function _parseCheckpointAsGeofenceRegions(tour: TourModel, checkpointIndex: number): Location.LocationRegion[] {
    const linkedCheckpoints = getLinkedCheckpoints(tour, checkpointIndex);
    return linkedCheckpoints.flatMap((linkedCheckpoint) => {
        return linkedCheckpoint.geometries.flatMap((geoCircle) => {
            return {
                identifier: RegionId.serialize({ tourIndex: tour.index, checkpointIndex: linkedCheckpoint.index }),
                latitude: geoCircle.lat,
                longitude: geoCircle.lng,
                radius: geoCircle.radius,
                notifyOnExit: false,
                notifyOnEnter: true,
            };
        });
    });
}


/**
 * Monitor the geofences linked to from the given checkpoint index.
 * Calls the callback defined in TaskManager.defineTask.
 */
function watchActiveCheckpoint(tour: TourModel, checkpointIndex: number): Promise<void> {
    const regions = _parseCheckpointAsGeofenceRegions(tour, checkpointIndex);
    if (regions.length > 20) {
        throw new Error('Max geofencing regions exceeded.');
    }
    if (!regions.length) {
        return Location.stopGeofencingAsync(GEOFENCE_BACKGROUND_TASK_NAME);
    }
    return Location.startGeofencingAsync(GEOFENCE_BACKGROUND_TASK_NAME, regions);
}


/**
 * Generate a Region object given a point and radius in meters.
 * NOTE: This is a lazy calculation based on a bad example which assumes the device is in portriat orientation.
 * https://github.com/react-native-community/react-native-maps/blob/master/example/examples/DisplayLatLng.js#L12
 */
function getRegion({ lat, lng, radiusMeters = 1000 }: { lat: number; lng: number; radiusMeters?: number }): Region {
    // latitudeDelta: the amount of north-to-south distance (measured in degrees) to display on the map.
    // Unlike longitudinal distances, which vary based on the latitude, one degree of latitude is always
    // approximately 111 kilometers (69 miles).
    const { width, height } = Dimensions.get('window');
    const aspectRatio = width / height;
    const latitudeDelta = radiusMeters / 111000;
    const longitudeDelta = latitudeDelta * aspectRatio;
    return {
        latitude: lat,
        longitude: lng,
        latitudeDelta,
        longitudeDelta,
    };
}


/**
 * Resolve to true if location services are available.
 * Attempts to prompt the user if not already enabled (device-specific).
 * NOTE: An error will be thrown if location permissions have not been granted.
 */
async function isLocationServiceEnabled(): Promise<boolean> {
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (isEnabled) {
        return true;
    }
    try {
        await Location.getCurrentPositionAsync(DEFAULT_LOCATION_OPTIONS);
        return true;
    }
    catch (err) {
        // Handle the anticipated error and return false
        if (err.code === 'E_LOCATION_SETTINGS_UNSATISFIED') {
            return false;
        }
        // Do not handle an unanticipated error
        throw new Error(err);
    }
}


export default {
    DEFAULT_LOCATION_OPTIONS,
    getLinkedGeometries,
    getLinkedCheckpoints,
    getLinkedGeometriesLatLng,
    watchActiveCheckpoint,
    defineBackgroundTasks,
    getRegion,
    isLocationServiceEnabled,
};

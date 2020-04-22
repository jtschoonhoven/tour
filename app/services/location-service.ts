import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import get from 'lodash/get';

import { TourModel, CheckpointModel, GeoCircle } from '../store/tours-store';


const GEOFENCE_BACKGROUND_TASK_NAME = '__tour__';


TaskManager.defineTask(GEOFENCE_BACKGROUND_TASK_NAME, ({ data, error }) => {
    const eventType = get(data, 'eventType');
    const region = get(data, 'region');

    if (error) {
        throw new Error(error.message);
    }
    if (eventType !== Location.GeofencingEventType.Enter) {
        throw new Error(`Unexpected event type: ${eventType}`);
    }
    if (typeof eventType !== 'string') {
        throw new Error(`Unexpected event type: ${eventType}`);
    }
    // eslint-disable-next-line no-console
    console.log(`ENTERED REGION ${region}`); // TODO
});


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


function getLinkedGeometries(tour: TourModel, checkpointIndex: number): GeoCircle[] {
    const linkedCheckpoints = getLinkedCheckpoints(tour, checkpointIndex);
    return linkedCheckpoints.flatMap((linkedCheckpoint) => linkedCheckpoint.geometries);
}

/**
 * Parse a CheckpointModel and return an array of LocationRegions for all linked geometries.
 */
function _parseCheckpointAsGeofenceRegions(tour: TourModel, checkpointIndex: number): Location.LocationRegion[] {
    const linkedCheckpoints = getLinkedCheckpoints(tour, checkpointIndex);
    return linkedCheckpoints.flatMap((linkedCheckpoint) => {
        return linkedCheckpoint.geometries.flatMap((geoCircle) => {
            return {
                identifier: linkedCheckpoint.name,
                latitude: geoCircle.lat,
                longitude: geoCircle.lng,
                radius: geoCircle.radius,
                notifyOnExit: false,
            };
        });
    });
}


function watchActiveCheckpoint(tour: TourModel, checkpointIndex: number): void {
    const regions = _parseCheckpointAsGeofenceRegions(tour, checkpointIndex);
    Location.startGeofencingAsync(GEOFENCE_BACKGROUND_TASK_NAME, regions);
}


export default {
    getLinkedGeometries,
    getLinkedCheckpoints,
    watchActiveCheckpoint,
};

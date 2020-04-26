import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import get from 'lodash/get';

import actions from '../store/actions';
import { TourModel, CheckpointModel, GeoCircle, RegionId } from '../store/tours-store';


const GEOFENCE_BACKGROUND_TASK_NAME = '__tour__';


/**
 * Define system-level background tasks to monitor. MUST BE CALLED IN GLOBAL SCOPE ON APP LOAD.
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


export default {
    getLinkedGeometries,
    getLinkedCheckpoints,
    watchActiveCheckpoint,
    defineBackgroundTasks,
};

import { EventEmitter } from 'events';

// Global event emitter is a Native-friendly port of the Node EventEmitter.
// Node docs at: https://nodejs.org/api/events.html
const _GLOBAL_EVENT_EMITTER = new EventEmitter();
const _EVENT_IDS = {
    GEOFENCE_ENTER: Symbol('__geofenceEnter__'),
};

export interface GeofenceEnterEventData {
    tourIndex: number;
    checkpointIndex: number;
}


function emitGeofenceEnterEvent(eventData: GeofenceEnterEventData): void {
    _GLOBAL_EVENT_EMITTER.emit(_EVENT_IDS.GEOFENCE_ENTER, eventData);
}


function onEmitGeofenceEnterEvent(cb: (data: GeofenceEnterEventData) => void): () => void {
    _GLOBAL_EVENT_EMITTER.on(_EVENT_IDS.GEOFENCE_ENTER, cb);
    return (): void => { _GLOBAL_EVENT_EMITTER.off(_EVENT_IDS.GEOFENCE_ENTER, cb); };
}


function onceOnEmitGeofenceEnterEvent(cb: (data: GeofenceEnterEventData) => void): void {
    _GLOBAL_EVENT_EMITTER.once(_EVENT_IDS.GEOFENCE_ENTER, cb);
}


export default {
    emitGeofenceEnterEvent,
    onEmitGeofenceEnterEvent,
    onceOnEmitGeofenceEnterEvent,
};

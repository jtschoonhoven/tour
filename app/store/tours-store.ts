import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface GeoCircle {
    type: 'geocircle';
    lat: number;
    lng: number;
    radius: number;
}

export interface GeoMarker {
    type: 'marker';
    lat: number;
    lng: number;
    title: string;
}

export interface CheckpointModel {
    name: string;
    text: string;
    geometries: Array<GeoCircle>;
    markers: Array<GeoMarker>;
    linkIndices: Array<number>;
    index: number;
}

export interface TourModel {
    uuid: string;
    name: string;
    index: number;
    schemaName: string;
    schemaVersion: string;
    createdAtMs: number;
    checkpoints: Array<CheckpointModel>;
}

export interface TourMeta {
    toursIndex: number;
    tourName: string;
    isStarted: boolean;
    isFinished: boolean;
    checkpointIndex: number;
}

interface ToursState {
    tours: Array<TourModel>;
    currentTour?: TourMeta;
    toursStarted: { [tourIndex: number]: TourMeta };
}

const INITIAL_STATE: ToursState = {
    tours: [],
    currentTour: undefined,
    toursStarted: {},
};


interface RegionIdInterface {
    readonly error?: Error;
    readonly tourIndex: number;
    readonly checkpointIndex: number;
}


export class RegionId implements RegionIdInterface {
    readonly error?: Error;
    readonly tourIndex: number;
    readonly checkpointIndex: number;

    constructor(input: string | RegionIdInterface) {
        try {
            if (typeof input === 'string') {
                const { tourIndex, checkpointIndex } = RegionId.deserialize(input);
                this.tourIndex = tourIndex;
                this.checkpointIndex = checkpointIndex;
            }
            else {
                this.tourIndex = input.tourIndex;
                this.checkpointIndex = input.checkpointIndex;
            }
        }
        catch (err) {
            this.error = err;
            this.tourIndex = -1;
            this.checkpointIndex = -1;
        }
    }

    static serialize(regionId: RegionIdInterface): string {
        return JSON.stringify(regionId);
    }

    static deserialize(regionIdStr: string): RegionIdInterface {
        return JSON.parse(regionIdStr);
    }

    asObject(): RegionIdInterface {
        return {
            tourIndex: this.tourIndex,
            checkpointIndex: this.checkpointIndex,
        };
    }

    toString(): string {
        return RegionId.serialize(this.asObject());
    }
}


function loadReducer(state: ToursState, action: PayloadAction<TourModel>): ToursState {
    const tour = action.payload;
    return Object.assign(state, { tours: [...state.tours, tour] });
}


function tourFinishedReducer(state: ToursState, action: PayloadAction<number>): ToursState {
    const tourIndex = action.payload;
    const { currentTour } = state;

    if (!currentTour) {
        throw new Error('Cannot mark the current tour finished when no tour is active!');
    }
    if (tourIndex !== currentTour.toursIndex) {
        throw new Error(`Cannot complete #${tourIndex}: the current tour is #${currentTour.toursIndex}`);
    }
    return { ...state, currentTour };
}


function tourStartReducer(state: ToursState, action: PayloadAction<number>): ToursState {
    const tourIndex = action.payload;

    // Throw if tour index is out of bounds
    if (tourIndex >= state.tours.length) {
        throw new Error(`Tour index "${tourIndex}" is out of bounds in tours list (len ${state.tours.length}).`);
    }

    const tour = state.tours[tourIndex];

    // Throw if tour is already started
    if (state.currentTour && state.currentTour.toursIndex === tourIndex) {
        if (state.currentTour.isStarted) {
            throw new Error('Tour has already started!');
        }
    }

    // If there is already an active tour, move it to toursStarted
    const toursStarted = { ...state.toursStarted };
    if (state.currentTour) {
        toursStarted[state.currentTour.toursIndex] = state.currentTour;
    }

    // If this tour already exists in toursStarted, set currentTour from there
    let currentTour: TourMeta;
    if (tourIndex in toursStarted) {
        currentTour = toursStarted[tourIndex];
    }
    else {
        currentTour = {
            toursIndex: tourIndex,
            tourName: tour.name,
            isStarted: true,
            isFinished: false,
            checkpointIndex: 0,
        };
    }


    return { ...state, toursStarted, currentTour };
}


function enterCheckpointReducer(state: ToursState, action: PayloadAction<RegionIdInterface>): ToursState {
    const regionId = new RegionId(action.payload);
    const currentTourMeta = state.currentTour;

    if (regionId.error) {
        throw regionId.error;
    }
    if (!currentTourMeta) {
        throw new Error('A new checkpoint was entered, but no tour is active!');
    }
    if (regionId.tourIndex !== currentTourMeta.toursIndex) {
        throw new Error('Entered checkpoint in an inactive tour.');
    }
    if (currentTourMeta.toursIndex > state.tours.length) {
        throw new Error(`Index of current tour ${currentTourMeta.toursIndex} is not in tours list.`);
    }
    if (!currentTourMeta.isStarted) {
        throw new Error('Tour has not been started');
    }
    if (currentTourMeta.isFinished) {
        throw new Error('Tour is already finished.');
    }

    const tour = state.tours[currentTourMeta.toursIndex];

    if (regionId.checkpointIndex >= tour.checkpoints.length) {
        throw new Error(`Index of new checkpoint "${regionId.checkpointIndex}" is not in tour.`);
    }

    return {
        ...state,
        currentTour: { ...currentTourMeta, checkpointIndex: regionId.checkpointIndex },
    };
}


export default createSlice({
    name: 'tours',
    initialState: INITIAL_STATE,
    reducers: {
        load: loadReducer,
        enterCheckpoint: enterCheckpointReducer,
        tourStart: tourStartReducer,
        tourFinished: tourFinishedReducer,
    },
});

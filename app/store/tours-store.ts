import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface GeoCircle {
    type: 'geocircle';
    lat: number;
    lng: number;
    radius: number;
}

export interface CheckpointModel {
    name: string;
    text: string;
    geometries: Array<GeoCircle>;
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
    toursStarted: Array<TourMeta>;
}

const INITIAL_STATE: ToursState = {
    tours: [],
    currentTour: undefined,
    toursStarted: [],
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


function tourStartReducer(state: ToursState, action: PayloadAction<number>): ToursState {
    const tourIndex = action.payload;

    // throw if tour index is out of bounds
    if (tourIndex >= state.tours.length) {
        throw new Error(`Tour index "${tourIndex}" is out of bounds in tours list (len ${state.tours.length}).`);
    }

    const tour = state.tours[tourIndex];

    // throw if tour is already started
    if (state.currentTour && state.currentTour.toursIndex === tourIndex) {
        if (state.currentTour.isStarted) {
            throw new Error('Tour has already started!');
        }
    }

    const tourMeta: TourMeta = {
        toursIndex: tourIndex,
        tourName: tour.name,
        isStarted: true,
        isFinished: false,
        checkpointIndex: 0,
    };

    return { ...state, currentTour: tourMeta };
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
    },
});

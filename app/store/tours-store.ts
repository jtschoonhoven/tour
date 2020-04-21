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
}

export interface TourModel {
    uuid: string;
    name: string;
    schemaName: string;
    schemaVersion: string;
    createdAtMs: number;
    checkpoints: Array<CheckpointModel>;
}

interface TourMeta {
    tourVersion: string;
    toursIndex: number;
    tourName: string;
    isStarted: boolean;
    isFinished: boolean;
    completedPassagePids: Array<number>;
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


function loadReducer(state: ToursState, action: PayloadAction<TourModel>): ToursState {
    const tour = action.payload;
    return Object.assign(state, { tours: [...state.tours, tour] });
}


export default createSlice({
    name: 'tours',
    initialState: INITIAL_STATE,
    reducers: {
        load: loadReducer,
    },
});

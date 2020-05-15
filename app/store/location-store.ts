import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface LocationState {
    isLocationPermissionGranted: boolean;
    isLocationPermissionLoading: boolean;
    isLocationPermissionBlocked: boolean;
    isLocationServiceEnabled: boolean;
}

const INITIAL_STATE: LocationState = {
    isLocationPermissionGranted: false,
    isLocationPermissionLoading: false,
    isLocationPermissionBlocked: false,
    isLocationServiceEnabled: false,
};


function setIsLocationPermissionGrantedReducer(state: LocationState, action: PayloadAction<boolean>): LocationState {
    const isLocationPermissionGranted = action.payload;
    return { ...state, isLocationPermissionGranted };
}


function setIsLocationPermissionLoadingReducer(state: LocationState, action: PayloadAction<boolean>): LocationState {
    const isLocationPermissionLoading = action.payload;
    return { ...state, isLocationPermissionLoading };
}


function setIsLocationPermissionBlockedReducer(state: LocationState, action: PayloadAction<boolean>): LocationState {
    const isLocationPermissionBlocked = action.payload;
    return { ...state, isLocationPermissionBlocked };
}


function setIsLocationServiceEnabledReducer(state: LocationState, action: PayloadAction<boolean>): LocationState {
    const isLocationServiceEnabled = action.payload;
    return { ...state, isLocationServiceEnabled };
}


export default createSlice({
    name: 'location',
    initialState: INITIAL_STATE,
    reducers: {
        setIsLocationPermissionGranted: setIsLocationPermissionGrantedReducer,
        setIsLocationPermissionLoading: setIsLocationPermissionLoadingReducer,
        setIsLocationPermissionBlocked: setIsLocationPermissionBlockedReducer,
        setIsLocationServiceEnabled: setIsLocationServiceEnabledReducer,
    },
});

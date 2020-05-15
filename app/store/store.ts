import { configureStore, combineReducers } from '@reduxjs/toolkit';

import toursStore from './tours-store';
import locationStore from './location-store';


const rootReducer = combineReducers({
    tours: toursStore.reducer,
    location: locationStore.reducer,
});

/**
 * Initialize the Redux global state store.
 */
const store = configureStore({
    reducer: rootReducer,
});


export default store;
export type AppDispatch = typeof store.dispatch;
export type AppReducer = typeof rootReducer;
export type AppState = ReturnType<typeof rootReducer>;

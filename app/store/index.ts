import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { bindActionCreators } from 'redux';

import toursStore from './tours-store';
import twineService from '../services/twine-service';
import geoTest from '../fixtures/tours/geo-test.json';


const rootReducer = combineReducers({
    tours: toursStore.reducer,
});

/**
 * Initialize the Redux global state store.
 */
const store = configureStore({
    reducer: rootReducer,
});
export default store;

/**
 * Bind dispatch to actions for each slice.
 */
export const actions = {
    tours: bindActionCreators(toursStore.actions, store.dispatch),
};

export type AppDispatch = typeof store.dispatch;
export type AppReducer = typeof rootReducer;
export type AppState = ReturnType<typeof rootReducer>;


// TODO: this is for testing only: replace with a better way to load tours
actions.tours.load(twineService.parseTwineToJsonExport(geoTest, 0));

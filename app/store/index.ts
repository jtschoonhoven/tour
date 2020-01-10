import { configureStore } from '@reduxjs/toolkit';
import { bindActionCreators } from 'redux'

import toursStore from './tours-store';


/**
 * Initialize the Redux global state store.
 */
const store = configureStore({
  reducer: {
    tours: toursStore.reducer,
  }
});


/**
 * Bind dispatch to actions for each slice.
 */
const actions = {
  tours: bindActionCreators(toursStore.actions, store.dispatch),
};


export { actions };
export default store;

import { bindActionCreators } from 'redux';

import store from './store';
import toursStore from './tours-store';
import twineService from '../services/twine-service';
import geoTest from '../fixtures/tours/geo-test.json';


/**
 * Bind dispatch to actions for each slice.
 */
const actions = {
    tours: bindActionCreators(toursStore.actions, store.dispatch),
};
export default actions;

// TODO: this is for testing only: replace with a better way to load tours
actions.tours.load(twineService.parseTwineToJsonExport(geoTest, 0));

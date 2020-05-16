import {
    NavigationActions,
    NavigationParams,
    NavigationContainerComponent,
} from 'react-navigation';

import { ROUTE_NAME } from '../constants';


let _NAVIGATOR: NavigationContainerComponent | null = null;


/**
 * Special-purpose function to extract the top-level navigator from react-navigation.
 * https://reactnavigation.org/docs/4.x/navigating-without-navigation-prop
 */
function receiveNavigatorRef(navigatorRef: NavigationContainerComponent | null): void {
    _NAVIGATOR = navigatorRef;
}


/**
 * Navigate between screens.
 * https://reactnavigation.org/docs/4.x/navigating-without-navigation-prop
 */
function navigate(routeName: ROUTE_NAME, params?: NavigationParams): void {
    if (!_NAVIGATOR) {
        throw new Error('Navigation action dispatched before navigation container rendered.');
    }
    _NAVIGATOR.dispatch(NavigationActions.navigate({ routeName, params }));
}


export default {
    receiveNavigatorRef,
    navigate,
};

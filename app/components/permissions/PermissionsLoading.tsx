import React from 'react';
import * as Permissions from 'expo-permissions';
import { connect } from 'react-redux';

import AppLoading from '../common/AppLoading';
import PermissionsRequesting from './PermissionsRequesting';
import PermissionsDisabled from './PermissionsDisabled';
import actions from '../../store/actions';
import locationService from '../../services/location-service';
import { ROUTE_NAMES } from '../../constants';
import { ReactNavFC, ReactNavProp } from '../../types';
import { AppState } from '../../store/store';


interface StateProps {
    isLocationPermissionLoading: boolean;
    isLocationPermissionGranted: boolean;
    isLocationServiceEnabled: boolean;
}


function mapStateToProps(state: AppState): StateProps {
    return {
        isLocationPermissionLoading: state.location.isLocationPermissionLoading,
        isLocationPermissionGranted: state.location.isLocationPermissionGranted,
        isLocationServiceEnabled: state.location.isLocationServiceEnabled,
    };
}


async function checkLocationPermissionGranted(isAlreadyGranted: boolean): Promise<void> {
    if (isAlreadyGranted) {
        return;
    }
    const permissionResponse = await Permissions.getAsync(Permissions.LOCATION);
    const isGranted = permissionResponse.status === 'granted';
    if (isGranted !== isAlreadyGranted) {
        actions.location.setIsLocationPermissionGranted(isGranted);
    }
}


async function checkLocationServiceEnabled(navigation: ReactNavProp, isPermissionGranted: boolean): Promise<void> {
    if (!isPermissionGranted) {
        return;
    }
    const isEnabled = await locationService.isLocationServiceEnabled();
    actions.location.setIsLocationServiceEnabled(isEnabled);
    if (isEnabled) {
        actions.location.setIsLocationPermissionLoading(false);
        navigation.navigate(ROUTE_NAMES.AUTH_LOADING);
    }
}


const PermissionsLoading: ReactNavFC<StateProps> = (props) => {
    const {
        navigation,
        isLocationPermissionGranted,
        isLocationPermissionLoading,
        isLocationServiceEnabled,
    } = props;

    // Check whether location permission is granted and update state
    React.useEffect(() => {
        checkLocationPermissionGranted(isLocationPermissionGranted);
    }, []);

    // Check whether location services are enabled and (if enabled) redirect to auth view
    React.useEffect(() => {
        checkLocationServiceEnabled(navigation, isLocationPermissionGranted);
    }, [isLocationPermissionGranted]);

    // Show view to request permissions if not already granted
    if (!isLocationPermissionLoading && !isLocationPermissionGranted) {
        return <PermissionsRequesting />;
    }

    // Show prompt if permissions are granted but location services are not enabled
    if (!isLocationPermissionLoading && isLocationPermissionGranted && !isLocationServiceEnabled) {
        return <PermissionsDisabled />;
    }

    // shows loading view while confirming permissions
    return <AppLoading />;
};
export default connect(mapStateToProps)(PermissionsLoading);

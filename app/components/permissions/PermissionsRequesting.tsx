import React from 'react';
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
import { Button, Text } from 'native-base';

import PermissionsBlocked from './PermissionsBlocked';
import Alert from '../common/Alert';
import AppView from '../common/AppView';
import actions from '../../store/actions';
import { AppState } from '../../store/store';


interface StateProps {
    isLocationPermissionBlocked: boolean;
}


function mapStateToProps(state: AppState): StateProps {
    return {
        isLocationPermissionBlocked: state.location.isLocationPermissionBlocked,
    };
}


const PermissionsRequesting: React.FC<StateProps> = ({ isLocationPermissionBlocked }) => {
    async function requestPermission(): Promise<void> {
        try {
            const permissionResponse = await Permissions.askAsync(Permissions.LOCATION);
            const isGranted = permissionResponse.status === 'granted';
            actions.location.setIsLocationPermissionGranted(isGranted);
            actions.location.setIsLocationPermissionBlocked(!isGranted);
        }
        catch (err) {
            console.error(`Permissions.askAsync failed:\n${err}`);
            actions.location.setIsLocationPermissionGranted(false);
            actions.location.setIsLocationPermissionBlocked(true);
        }
    }

    if (isLocationPermissionBlocked) {
        return <PermissionsBlocked />;
    }

    return (
        <AppView>
            <Alert title="Alert!">
                <Text>This app needs to access your GPS to guide you on your tour.</Text>
                <Button onPress={ requestPermission }>
                    <Text>Grant GPS Access</Text>
                </Button>
            </Alert>
        </AppView>
    );
};
export default connect(mapStateToProps)(PermissionsRequesting);

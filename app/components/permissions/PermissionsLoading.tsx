import React from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import * as Permissions from 'expo-permissions';

import AppLoading from '../common/AppLoading';
import PermissionsRequesting from './PermissionsRequesting';
import { ROUTE_NAMES } from '../../constants';
import { ReactNavFC } from '../../types';


interface Permission {
    type: Permissions.PermissionType;
    requestMessage: string;
}


const PERMISSIONS: Array<Permission> = [
    {
        type: Permissions.LOCATION,
        requestMessage: 'Location is required to guide you on your tour.',
    },
];


const PermissionsLoading: ReactNavFC = ({ navigation }) => {
    const [isPermissionsLoading, setIsPermissionsLoading] = React.useState<boolean>(true);
    const [isPermissionsGranted, setIsPermissionsGranted] = React.useState<boolean>(false);

    React.useEffect(() => {
        Permissions.getAsync(Permissions.LOCATION)
            .then((permissionResponse) => {
                const isGranted = permissionResponse.status === 'granted';
                setIsPermissionsLoading(false);
                setIsPermissionsGranted(isGranted);
            });
    });

    if (isPermissionsLoading) {
        return <AppLoading />;
    }

    if (!isPermissionsGranted) {
        return <PermissionsRequesting setIsPermissionsGranted={ setIsPermissionsGranted } />;
    }

    navigation.navigate(ROUTE_NAMES.AUTH_LOADING);
    return <AppLoading />; // displayed only until navigation action completes
};
export default PermissionsLoading;

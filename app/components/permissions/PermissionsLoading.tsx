import React from 'react';
import * as Permissions from 'expo-permissions';

import AppLoading from '../common/AppLoading';
import PermissionsRequesting from './PermissionsRequesting';
import { ROUTE_NAMES } from '../../constants';
import { ReactNavFC } from '../../types';


const PermissionsLoading: ReactNavFC = ({ navigation }) => {
    const [isPermissionsLoading, setIsPermissionsLoading] = React.useState<boolean>(true);
    const [isPermissionsGranted, setIsPermissionsGranted] = React.useState<boolean>(false);

    // check permissions async then update state
    React.useEffect(() => {
        Permissions.getAsync(Permissions.LOCATION)
            .then((permissionResponse) => {
                const isGranted = permissionResponse.status === 'granted';
                setIsPermissionsLoading(false);
                setIsPermissionsGranted(isGranted);
            });
    }, []);

    // redirect if permission is granted
    React.useEffect(() => {
        if (isPermissionsGranted) {
            navigation.navigate(ROUTE_NAMES.AUTH_LOADING);
        }
    }, [isPermissionsGranted]);

    // show permissions request view if not granted
    if (!isPermissionsLoading && !isPermissionsGranted) {
        return <PermissionsRequesting setIsPermissionsGranted={ setIsPermissionsGranted } />;
    }

    // shows loading view while confirming permissions
    return <AppLoading />;
};
export default PermissionsLoading;

import React from 'react';
import * as Permissions from 'expo-permissions';
import { Button, Text } from 'native-base';

import PermissionsBlocked from './PermissionsBlocked';
import Alert from '../common/Alert';
import AppView from '../common/AppView';


interface Props {
    setIsPermissionsGranted: (isGranted: boolean) => void;
}


const PermissionsRequesting: React.FC<Props> = ({ setIsPermissionsGranted }: Props) => {
    const [isPermissionsBlocked, setIsPermissionsBlocked] = React.useState<boolean>(false);

    async function requestPermission(): Promise<void> {
        try {
            const permissionResponse = await Permissions.askAsync(Permissions.LOCATION);
            const isGranted = permissionResponse.status === 'granted';
            setIsPermissionsGranted(isGranted);
            setIsPermissionsBlocked(!isGranted);
        }
        catch (err) {
            console.error(`Permissions.askAsync failed:\n${err}`);
            setIsPermissionsGranted(false);
            setIsPermissionsBlocked(true);
        }
    }

    if (isPermissionsBlocked) {
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
export default PermissionsRequesting;

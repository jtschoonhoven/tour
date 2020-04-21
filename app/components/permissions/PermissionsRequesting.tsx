import React from 'react';
import { View } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Button, Text } from 'native-base';


interface Props {
    setIsPermissionsGranted: (isGranted: boolean) => void;
}


const PermissionsRequesting: React.FC<Props> = ({ setIsPermissionsGranted }: Props) => {
    const [isPermissionsBlocked, setIsPermissionsBlocked] = React.useState<boolean>(false);
    function onPress() {
        Permissions.askAsync(Permissions.LOCATION)
            .then((permissionResponse) => {
                const isGranted = permissionResponse.status === 'granted';
                setIsPermissionsGranted(isGranted);
                setIsPermissionsBlocked(!isGranted);
            });
    }

    let requestText = 'This app needs to access your GPS to guide you on your tour.';
    if (isPermissionsBlocked) {
        requestText = 'GPS permission has been blocked by your device.';
    }

    return (
        <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
            <Text>{ requestText }</Text>
            <Button onPress={ onPress } >
                <Text>Grant GPS Access</Text>
            </Button>
        </View>
    );
};
export default PermissionsRequesting;

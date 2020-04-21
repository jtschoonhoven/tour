import React from 'react';
import { Linking } from 'expo';
import { Button, Text } from 'native-base';


import AppView from '../common/AppView';
import Alert from '../common/Alert';
import Br from '../common/Br';


const PermissionsBlocked: React.FC = () => {
    const [openAppSettingsErrorMsg, setOpenAppSettingsErrorMsg] = React.useState<string>('');

    function openAppSettings(): void {
        Linking.canOpenURL('app-settings:')
            .then((isSupported) => {
                if (!isSupported) {
                    Linking.openURL('app-settings:');
                }
                throw new Error('Opening app settings is not supported on this device.');
            })
            .catch(() => {
                const msg = 'Failed to open app settings. Sorry. You\'ll need to do this yourself and restart the app.';
                setOpenAppSettingsErrorMsg(msg);
            });
    }

    return (
        <AppView>
            <Alert title="Permission Required">
                <Text>
                    This app needs access to your GPS to function, but it has been blocked on your device.
                    <Br /><Br />
                    You will need to manually allow location access in your device settings to continue.
                </Text>
                {
                    !openAppSettingsErrorMsg ? (
                        <Button onPress={ openAppSettings }>
                            <Text>Open app settings.</Text>
                        </Button>
                    ) : (
                        <Text>{ openAppSettingsErrorMsg }</Text>
                    )
                }
            </Alert>
        </AppView>
    );
};
export default PermissionsBlocked;

import React from 'react';
import { Platform } from 'react-native';
import { Linking } from 'expo';
import { Button, Text } from 'native-base';
import * as IntentLauncher from 'expo-intent-launcher';

import AppView from '../common/AppView';
import Alert from '../common/Alert';
import Br from '../common/Br';


/**
 * Open the device location settings view for Android devices. Throws on any failure.
 */
async function _openAppSettingsAndroid(): Promise<void> {
    const intentLauncherResult = await IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS,
    );
    // throw if result code is not "Success"
    if (intentLauncherResult.resultCode !== IntentLauncher.ResultCode.Success) {
        let msg = 'Unknown error.';
        if (intentLauncherResult.data) {
            msg = intentLauncherResult.data;
        }
        throw new Error(`Error while opening app settings: ${msg}`);
    }
}


/**
 * Open the application settings view for iOS devices. Throws on any failure.
 */
async function _openAppSettingsIos(): Promise<void> {
    const canOpenUrl = await Linking.canOpenURL('app-settings:');
    // throw if unable to open url
    if (!canOpenUrl) {
        throw new Error('Opening app settings is not supported on this device.');
    }
    await Linking.openURL('app-settings:');
}


/**
 * Open the relevant settings view per platform. Updates error message state on any failure.
 */
async function openAppSettings(setErrorMsg: (msg: string) => void): Promise<void> {
    try {
        if (Platform.OS === 'android') {
            await _openAppSettingsAndroid();
        }
        else {
            await _openAppSettingsIos();
        }
    }
    catch (err) {
        console.error(err);
        const msg = 'Failed to open app settings. Sorry. You\'ll need to do this yourself and restart the app.';
        setErrorMsg(msg);
    }
}


/**
 * Handles case where required permissions are blocked.
 */
const PermissionsBlocked: React.FC = () => {
    const [openAppSettingsErrorMsg, setOpenAppSettingsErrorMsg] = React.useState<string>('');

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
                        <Button onPress={ (): void => { openAppSettings(setOpenAppSettingsErrorMsg); } }>
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

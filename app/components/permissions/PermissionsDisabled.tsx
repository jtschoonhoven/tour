import React from 'react';
import { Button, Text } from 'native-base';

import locationService from '../../services/location-service';
import actions from '../../store/actions';
import Alert from '../common/Alert';
import AppView from '../common/AppView';


async function checkIsLocationServiceEnabled(): Promise<void> {
    const isEnabled = await locationService.isLocationServiceEnabled();
    if (isEnabled) {
        actions.location.setIsLocationServiceEnabled(true);
    }
}


const PermissionsDisabled: React.FC = () => {
    // NOTE: it would be better if we could prompt the user to enable location services from within the app
    return (
        <AppView>
            <Alert title="Alert!">
                <Text>
                    It looks like you don't have GPS location enabled on this device.
                    Please make sure GPS location is enabled, then click the button below.
                </Text>
                <Button onPress={ checkIsLocationServiceEnabled }>
                    <Text>I've enabled GPS</Text>
                </Button>
            </Alert>
        </AppView>
    );
};
export default PermissionsDisabled;

import React from 'react';
import { Button, Text } from 'native-base';

import navigationService from '../../services/navigation-service';
import locationService from '../../services/location-service';
import actions from '../../store/actions';
import Alert from '../common/Alert';
import AppView from '../common/AppView';
import { ROUTE_NAMES } from '../../constants';


const PermissionsDisabled: React.FC = () => {
    const [numAttempts, setNumAttempts] = React.useState<number>(0);

    async function checkIsLocationServiceEnabled(): Promise<void> {
        const isEnabled = await locationService.isLocationServiceEnabled();
        if (isEnabled) {
            actions.location.setIsLocationServiceEnabled(true);
            navigationService.navigate(ROUTE_NAMES.AUTH_LOADING);
            return;
        }
        setNumAttempts(numAttempts + 1);
    }

    return (
        <AppView>
            <Alert title="Alert!">
                <Text>
                    It looks like you don't have GPS location enabled on this device.
                    Please make sure GPS location is enabled, then click the button below.
                </Text>
                { !!numAttempts && (
                    <Text>Hmm, we still can't access your location. Try again?</Text>
                )}
                <Button onPress={ checkIsLocationServiceEnabled }>
                    <Text>I've enabled GPS</Text>
                </Button>
            </Alert>
        </AppView>
    );
};
export default PermissionsDisabled;

import React from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';
import { View, Button, Text } from 'react-native';

import { ReactNavFC } from '../../types';


export interface NavProps {
    title: string;
}

const ModalTourComplete: ReactNavFC<{}, NavProps> = ({ navigation }) => {
    return (
        <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
            <ConfettiCannon count={ 200 } origin={ { x: -10, y: 0 } } />
            <Text style={ { fontSize: 30 } }>You did it!</Text>
            <Button
                onPress={ (): void => { navigation.goBack(); } }
                title="Back"
            />
        </View>
    );
};
ModalTourComplete.navigationOptions = ({ navigation }): { title: string } => {
    return { title: navigation.getParam('title') };
};

export default ModalTourComplete;

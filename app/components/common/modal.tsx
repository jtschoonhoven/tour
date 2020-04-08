import React from 'react';
import { View, Button, Text } from 'react-native';

import { ReactNavFC } from '../../types';

interface ModalOptions {
    modal: {
        title: string;
    };
}

const Modal: ReactNavFC<{}, ModalOptions> = ({ navigation }) => {
    return (
        <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
            <Text style={ { fontSize: 30 } }>This is a modal!</Text>
            <Button
                onPress={ (): void => { navigation.goBack(); } }
                title="Back"
            />
        </View>
    );
};
Modal.navigationOptions = ({ navigation }): { title: string } => {
    const modal = navigation.getParam('modal');
    return { title: modal.title };
};

export default Modal;

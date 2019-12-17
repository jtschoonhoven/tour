import React from 'react';
import { AsyncStorage } from 'react-native';
import { Button, Content, Header, Text } from 'native-base';

import { ROUTE_NAMES, STORAGE_KEYS } from '../../constants';
import { ReactNavFC, ReactNavProp } from '../../types';


interface Tour {
    readonly id: number;
    readonly title: string;
    readonly description: string;
}

// navigation params passed to Tour child components
export interface TourScreenProps {
    readonly tour: Tour;
}

interface NavParams {
    tour: Tour;
}

// tmp stub for API
const toursStub: { tours: Tour[]} = {
    tours: [
        { id: 1, title: 'Tour One', description: 'So much fun!' },
        { id: 2, title: 'Tour Two', description: 'Wow go for it!' },
        { id: 3, title: 'Tour Three', description: 'Celebration time!' },
    ]
};


// navigable list of available tours
const TourList: ReactNavFC<{}, NavParams> = ({ navigation }) => {
    const Buttons = toursStub.tours.map((tour) => {
        return (
            <Button key={ tour.id } onPress={ () => navigation.navigate(ROUTE_NAMES.TOUR, { tour }) }>
                <Text>{ tour.title }</Text>
            </Button>
        );
    });
    const modal = { title: 'Example modal' };
    return (
        <Content>
            <Button onPress={ () => navigation.navigate(ROUTE_NAMES.MODAL, { modal }) }>
                <Text>{ 'Show modal' }</Text>
            </Button>
            { Buttons }
            <Button onPress={ () => logout(navigation) }>
                <Text>{ 'Logout' }</Text>
            </Button>
        </Content>
    );
}
TourList.navigationOptions = { title: 'Tours' };
export default TourList;


async function logout(navigation: ReactNavProp) {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    }
    catch (error) {
        // TODO: show alert
        throw error;
    }
    navigation.navigate(ROUTE_NAMES.LOGIN);
}

import React from 'react';
import { Button, View, Text } from 'react-native';

import { ROUTE_NAMES } from '../../constants';
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

interface Props {
    navigation: ReactNavProp<TourScreenProps>
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
const TourList: ReactNavFC<Props> = ({ navigation }) => {
    const Buttons = toursStub.tours.map((tour) => {
        return (
            <Button
                key={ tour.id }
                title={ tour.title }
                onPress={ () => navigation.navigate(ROUTE_NAMES.TOUR, { tour }) }
            />
        );
    });
    const modal = { title: 'Example modal' };
    return (
        <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
            <Text>Home Screen</Text>
            <Button title="Modal!" onPress={ () => navigation.navigate(ROUTE_NAMES.MODAL, { modal }) }></Button>
            { Buttons }
        </View>
    );
}
TourList.navigationOptions = { title: 'Tours' };
export default TourList;

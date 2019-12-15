import React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenProp } from 'react-navigation';

import { ROUTE_NAMES } from '../../constants';


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
    navigation: NavigationScreenProp<TourScreenProps>
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
const TourList: React.FC<Props> = ({ navigation }) => {
    const Buttons = toursStub.tours.map((tour) => {
        return (
            <Button
                key={ tour.id }
                title={ tour.title }
                onPress={ () => navigation.navigate(ROUTE_NAMES.TOUR, { tour }) }
            />
        );
    });
    return (
        <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
            <Text>Home Screen</Text>
            { Buttons }
        </View>
    );
}
export default TourList;

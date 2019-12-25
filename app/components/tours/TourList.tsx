import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-navigation';

import { ReactNavFC, ReactNavProp } from '../../types';
import TourListItem from './TourListItem';


const STYLE = StyleSheet.create({
    contentContainer: {
        padding: 10,
    }
});

export interface Tour {
    readonly id: string;
    readonly title: string;
    readonly description: string;
}

// tmp stub for API
const TOURS_STUB: Tour[] = [
    {id: '1', title: 'Tour One', description: 'So much fun!' },
    {id: '2', title: 'Tour Two', description: 'Wow go for it!' },
    {id: '3', title: 'Tour Three', description: 'Celebration time!' },
];


/**
 * List of Tour cards.
 */
const TourList: ReactNavFC = ({ navigation }) => {
    return (
        <FlatList
            data={ TOURS_STUB }
            contentContainerStyle={ STYLE.contentContainer }
            renderItem={ ({ item }) => renderTourListItem(item, navigation) } />
    );
}
export default TourList;


/**
 * Return a single Tour card
 */
function renderTourListItem(tour: Tour, navigation: ReactNavProp): ReactElement {
    return <TourListItem key={ tour.id } tour={ tour } navigation={ navigation } />
}

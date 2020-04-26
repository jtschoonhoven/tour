import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-navigation';
import { Button, Text } from 'native-base';

import TourListItem from './TourListItem';
import { ReactNavFC, ReactNavProp } from '../../types';
import { TourModel } from '../../store/tours-store';
import { AppState } from '../../store/store';


interface StateProps {
    tours: Array<TourModel>;
}


function mapStateToProps(state: AppState): StateProps {
    return {
        tours: state.tours.tours,
    };
}


const STYLE = StyleSheet.create({
    contentContainer: {
        padding: 10,
    },
});


const TestFooter: React.FC = () => {
    return <Button><Text>Test Footer</Text></Button>;
};


/**
 * Return a single Tour card
 */
function renderTourListItem(tour: TourModel, navigation: ReactNavProp): ReactElement {
    return <TourListItem key={ tour.uuid } tour={ tour } navigation={ navigation } />;
}


/**
 * List of Tour cards.
 */
const TourList: ReactNavFC<StateProps> = ({ navigation, tours }) => {
    return (
        <FlatList
            data={ tours }
            contentContainerStyle={ STYLE.contentContainer }
            ListFooterComponent={ (): ReactElement => <TestFooter /> }
            keyExtractor={ (_, index): string => index.toString() }
            renderItem={ ({ item }: { item: TourModel }): ReactElement => {
                return renderTourListItem(item, navigation);
            } }
        />
    );
};
export default connect(mapStateToProps)(TourList);

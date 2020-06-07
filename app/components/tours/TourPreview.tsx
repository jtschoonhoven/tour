import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import {
    Card,
    CardItem,
    Left,
    Body,
    Icon,
    Button,
    Text,
    Container,
    Footer,
} from 'native-base';

import { TourNavParams } from './Tour';
import { ReactNavFC } from '../../types';
import { ROUTE_NAMES } from '../../constants';
import { AppState } from '../../store/store';
import { TourModel } from '../../store/tours-store';


const STYLES = StyleSheet.create({
    card: {
        height: '100%',
    },
    cardItemImageView: {
        height: 200,
        width: '100%',
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardItemImageIcon: {
        fontSize: 60,
        color: '#CDCDCD',
    },
    footerButton: {
        width: '100%',
        height: '100%',
    },
});


export interface TourPreviewNavParams {
    title: string;
}

interface StateProps {
    tours: Array<TourModel>;
    tourIndex?: number;
    checkpointIndex?: number;
}

function mapStateToProps(state: AppState): StateProps {
    return {
        tourIndex: state.tours.currentTour?.toursIndex,
        checkpointIndex: state.tours.currentTour?.checkpointIndex,
        tours: state.tours.tours,
    };
}


const TourPreview: ReactNavFC<StateProps, TourPreviewNavParams> = (props) => {
    const { navigation, tourIndex, checkpointIndex, tours } = props;

    // Throw error if either tourIndex or checkpointIndex are undefined. This must be guarded against upstream.
    if (typeof tourIndex === 'undefined' || typeof checkpointIndex === 'undefined') {
        throw new Error(`Failed to render TourPreview with tour index ${tourIndex} and checkpoint ${checkpointIndex}.`);
    }

    const tour = tours[tourIndex];

    function onPress(): void {
        navigation.navigate<TourNavParams>(ROUTE_NAMES.TOUR, { title: tour.name });
    }

    return (
        <View style={ { flex: 1 } }>
            <Container>
                <Card style={ STYLES.card }>
                    <CardItem>
                        <Left>
                            <Body>
                                <View style={ STYLES.cardItemImageView }>
                                    <Icon name="images" style={ STYLES.cardItemImageIcon } />
                                </View>
                                <Text>{ tour.name }</Text>
                                <Text note>{ tour.name }</Text>
                            </Body>
                        </Left>
                    </CardItem>
                </Card>
            </Container>
            <Footer>
                <Button
                    full
                    style={ STYLES.footerButton }
                    onPress={ onPress }
                >
                    <Text>Launch</Text>
                </Button>
            </Footer>
        </View>
    );
};
TourPreview.navigationOptions = ({ navigation }): { title: string } => {
    const tourName = navigation.getParam('title');
    return { title: tourName };
};
export default connect(mapStateToProps)(TourPreview);

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

import actions from '../../store/actions';
import AppLoading from '../common/AppLoading';
import { TourMapNavParams } from './TourMap';
import { ReactNavFC } from '../../types';
import { ROUTE_NAMES } from '../../constants';
import { AppState } from '../../store/store';


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


export interface TourNavParams {
    tourIndex: number;
    tourName: string;
}

interface StateProps {
    activeTourIndex?: number;
    activeTourName?: string;
}

function mapStateToProps(state: AppState): StateProps {
    return {
        activeTourIndex: state.tours.currentTour?.toursIndex,
        activeTourName: state.tours.currentTour?.tourName,
    };
}


const Tour: ReactNavFC<StateProps, TourNavParams> = ({ navigation, activeTourIndex, activeTourName }) => {
    const navTourIndex = navigation.getParam('tourIndex');
    const navTourName = navigation.getParam('tourName');
    const isTourActive = navTourIndex === activeTourIndex;


    React.useEffect(() => {
        if (!isTourActive) {
            actions.tours.tourStart(navTourIndex);
        }
    }, [activeTourIndex, navTourIndex]);

    if (!isTourActive) {
        return <AppLoading />;
    }

    function onPress(): void {
        navigation.navigate<TourMapNavParams>(ROUTE_NAMES.TOUR_MAP, { tourName: navTourName });
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
                                <Text>{ activeTourName }</Text>
                                <Text note>{ activeTourName }</Text>
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
Tour.navigationOptions = ({ navigation }): { title: string } => {
    const tourName = navigation.getParam('tourName');
    return { title: tourName };
};
export default connect(mapStateToProps)(Tour);

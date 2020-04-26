import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import {
    Body,
    Card,
    CardItem,
    Left,
    Text,
    Button,
    Icon,
} from 'native-base';

import actions from '../../store/actions';
import { ROUTE_NAMES } from '../../constants';
import { ReactNavFC } from '../../types';
import { TourModel } from '../../store/tours-store';
import { TourNavParams } from './Tour';
import { AppState } from '../../store/store';


const STYLES = StyleSheet.create({
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
});


interface StateProps {
    activeTourIndex?: number;
}

function mapStateToProps(state: AppState): StateProps {
    return {
        activeTourIndex: state.tours.currentTour?.toursIndex,
    };
}


interface Props extends StateProps {
    tour: TourModel;
}


/**
 * A single Tour card in the TourList view.
 */
const TourListItem: ReactNavFC<Props> = ({ navigation, tour, activeTourIndex }) => {
    const [isLoadingTour, setIsLoadingTour] = React.useState<boolean>(false);

    // detect when screen is in focus and reactivate buttons
    React.useEffect(() => {
        const listener = navigation.addListener('didFocus', () => {
            setIsLoadingTour(false);
        });
        return (): void => { listener.remove(); };
    }, []);

    // load tour on click and navigate
    const onPress = (): void => {
        setIsLoadingTour(true);
        if (tour.index !== activeTourIndex) {
            actions.tours.tourStart(tour.index);
        }
        navigation.navigate<TourNavParams>(ROUTE_NAMES.TOUR, { tourIndex: tour.index, tourName: tour.name });
    };

    return (
        <TouchableHighlight onPress={ onPress }>
            <Card key={ tour.uuid }>
                <CardItem>
                    <Left>
                        <Body>
                            <Text>{ tour.name }</Text>
                            <Text note>{ tour.name }</Text>
                            <View style={ STYLES.cardItemImageView }>
                                <Icon name="images" style={ STYLES.cardItemImageIcon } />
                            </View>
                            <Button onPress={ onPress } disabled={ isLoadingTour }>
                                <Text>{ tour.name }</Text>
                            </Button>
                        </Body>
                    </Left>
                </CardItem>
            </Card>
        </TouchableHighlight>
    );
};
export default connect(mapStateToProps)(TourListItem);

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
import { TourPreviewNavParams } from './TourPreview';
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
    const [navigationPending, setNavigationPending] = React.useState(false);
    const tourIsActive = tour.index === activeTourIndex;

    // Reset navigationPending when focus returns to this view
    React.useEffect(() => {
        const listener = navigation.addListener('didFocus', () => {
            setNavigationPending(false);
        });
        return (): void => { listener.remove(); };
    }, []);

    // On press, queue up a navigation action for when tour is active in global state
    const onPress = (): void => {
        if (!tourIsActive) {
            actions.tours.tourStart(tour.index);
        }
        setNavigationPending(true);
    };

    // If navigation action is queued, navigate as soon as tour is active in global state
    React.useEffect(() => {
        if (navigationPending && tourIsActive) {
            navigation.navigate<TourPreviewNavParams>(ROUTE_NAMES.TOUR_PREVIEW, { title: tour.name });
        }
    }, [navigationPending, activeTourIndex]);

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
                            <Button onPress={ onPress } disabled={ navigationPending }>
                                <Text>{ navigationPending ? 'Loading' : tour.name }</Text>
                            </Button>
                        </Body>
                    </Left>
                </CardItem>
            </Card>
        </TouchableHighlight>
    );
};
export default connect(mapStateToProps)(TourListItem);

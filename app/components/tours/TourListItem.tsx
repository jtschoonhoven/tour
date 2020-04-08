import React from 'react';
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

import { ROUTE_NAMES } from '../../constants';
import { ReactNavFC } from '../../types';
import { TourModel } from '../../store/tours-store';


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

interface Props {
    tour: TourModel;
}


/**
 * A single Tour card in the TourList view.
 */
const TourListItem: ReactNavFC<Props> = ({ navigation, tour }) => {
    return (
        <TouchableHighlight onPress={ (): void => { navigation.navigate(ROUTE_NAMES.TOUR, { tour }); } }>
            <Card key={ tour.uuid }>
                <CardItem>
                    <Left>
                        <Body>
                            <Text>{ tour.name }</Text>
                            <Text note>{ tour.name }</Text>
                            <View style={ STYLES.cardItemImageView }>
                                <Icon name="images" style={ STYLES.cardItemImageIcon } />
                            </View>
                            <Button onPress={ (): void => { navigation.navigate(ROUTE_NAMES.TOUR, { tour }); } }>
                                <Text>{ tour.name }</Text>
                            </Button>
                        </Body>
                    </Left>
                </CardItem>
            </Card>
        </TouchableHighlight>
    );
};
export default TourListItem;

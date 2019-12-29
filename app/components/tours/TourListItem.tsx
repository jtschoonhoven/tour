import React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Body, Card, CardItem, Left, Text, Button, Icon } from 'native-base';

import { ROUTE_NAMES, STORAGE_KEYS } from '../../constants';
import { ReactNavFC, ReactNavProp } from '../../types';
import { Tour } from './TourList';


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
    tour: Tour;
}


/**
 * A single Tour card in the TourList view.
 */
const TourListItem: ReactNavFC<Props> = ({ navigation, tour }) => {
    return (
        <TouchableHighlight onPress={ () => navigation.navigate(ROUTE_NAMES.TOUR, { tour }) }>
            <Card key={ tour.id }>
                <CardItem>
                    <Left>
                        <Body>
                            <Text>{ tour.title }</Text>
                            <Text note>{ tour.description }</Text>
                            <View style={ STYLES.cardItemImageView } >
                                <Icon name="images" style={ STYLES.cardItemImageIcon } />
                            </View>
                            <Button onPress={ () => navigation.navigate(ROUTE_NAMES.TOUR, { tour }) }>
                                <Text>{ tour.title }</Text>
                            </Button>
                        </Body>
                    </Left>
                </CardItem>
            </Card>
        </TouchableHighlight>
    );
}
export default TourListItem;

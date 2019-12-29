import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardItem, Left, Body, Icon, Button, Text, Container, Footer, FooterTab } from 'native-base';

import { TourScreenProps } from './Tours';
import { ReactNavFC, ReactNavProp } from '../../types';
import { ROUTE_NAMES } from '../../constants';


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
    }
});

const Tour: ReactNavFC<{}, TourScreenProps> = ({ navigation }) => {
    const tour = navigation.getParam('tour');
    return (
        <View style={{ flex: 1 }}>
            <Container>
                <Card style={ STYLES.card }>
                    <CardItem>
                        <Left>
                            <Body>
                                <View style={ STYLES.cardItemImageView } >
                                    <Icon name="images" style={ STYLES.cardItemImageIcon } />
                                </View>
                                <Text>{ tour.title }</Text>
                                <Text note>{ tour.description }</Text>
                            </Body>
                        </Left>
                    </CardItem>
                </Card>
            </Container>
            <Footer>
                <Button
                    full
                    style={ STYLES.footerButton }
                    onPress={() => { navigation.navigate(ROUTE_NAMES.TOUR_MAP, { tour }) }}
                >
                    <Text>Launch</Text>
                </Button>
            </Footer>
        </View>
    );
};
Tour.navigationOptions = ({ navigation }) => {
    const tour = navigation.getParam('tour');
    const title = `Tour Screen #${ tour.id }`;
    return { title };
}
export default Tour;

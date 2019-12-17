import React from 'react';
import { StatusBar } from 'react-native';
import { getActiveChildNavigationOptions } from 'react-navigation';
import { HeaderProps } from 'react-navigation-stack';
import { Container, Header, Title, Button, Left, Right, Body, Icon } from 'native-base';

import { ReactNavFC } from '../../types';


/**
 * Custom header component.
 */
const NavHeader: ReactNavFC<HeaderProps> = ({ navigation }) => {
    const { title } = getActiveChildNavigationOptions(navigation);
    const canGoBack = !!navigation.state.index;
    let leftContent = null;
    if (canGoBack) {
        leftContent = (
            <Button transparent onPress={ () => { navigation.goBack(null) } }>
                <Icon name='arrow-back' />
          </Button>
        );
    }
    return (
        <Header style={{ paddingTop: StatusBar.currentHeight }}>
            <Left>{ leftContent }</Left>
            <Body>
                <Title>{ title }</Title>
            </Body>
            <Right />
        </Header>
    );
};
export default NavHeader;

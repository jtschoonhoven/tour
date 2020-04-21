import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { getActiveChildNavigationOptions } from 'react-navigation';
import { HeaderProps } from 'react-navigation-stack';
import {
    Header,
    Title,
    Button,
    Left,
    Right,
    Body,
    Icon,
} from 'native-base';

import { ReactNavFC } from '../../types';
import { IS_ANDROID } from '../../constants';


const STYLES = StyleSheet.create({
    // correct for native-base not adjusting for transparent status bar on Android
    header: IS_ANDROID ? {
        paddingTop: StatusBar.currentHeight || 0,
        height: 48 + (StatusBar.currentHeight || 0),
    } : {},
});


/**
 * Custom header component.
 */
const NavHeader: ReactNavFC<HeaderProps> = ({ navigation }) => {
    const { title } = getActiveChildNavigationOptions(navigation);
    const canGoBack = !!navigation.state.index;
    let leftContent = null;
    if (canGoBack) {
        leftContent = (
            <Button transparent onPress={ (): void => { navigation.goBack(null); } }>
                <Icon name="arrow-back" />
            </Button>
        );
    }
    return (
        <Header style={ STYLES.header }>
            <Left>{ leftContent }</Left>
            <Body>
                <Title>{ title }</Title>
            </Body>
            <Right />
        </Header>
    );
};
export default NavHeader;

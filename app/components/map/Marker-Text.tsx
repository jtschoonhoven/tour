import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker, MarkerProps, Callout } from 'react-native-maps';
import noop from 'lodash/noop';


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
    },
    bubble: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: '#FF5A5F',
        padding: 2,
        borderRadius: 3,
        borderColor: '#D23F44',
        borderWidth: 0.5,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: '#FF5A5F',
        alignSelf: 'center',
        marginTop: -9,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: '#D23F44',
        alignSelf: 'center',
        marginTop: -0.5,
    },
});


interface Props extends MarkerProps {
    title: string;
}


const MarkerText: React.FC<Props> = (props) => {
    return (
        <Marker { ...props } onPress={ noop }>
            <>
                <View style={ styles.container } key="zxs">
                    <View style={ styles.bubble }>
                        <Text style={ [styles.label] }>{ props.title }</Text>
                    </View>
                    <View style={ styles.arrowBorder } />
                    <View style={ styles.arrow } />
                </View>
            </>
            {/* Hack to disable callout: https://github.com/react-native-community/react-native-maps/issues/482 */}
            <Callout key="zby" tooltip>
                <View><Text> </Text></View>
            </Callout>
        </Marker>
    );
};
export default MarkerText;

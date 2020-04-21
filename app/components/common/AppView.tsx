import React from 'react';
import { View, FlexStyle } from 'react-native';


interface Props extends React.PropsWithChildren<{}> {
    flex?: FlexStyle['flex'];
    alignItems?: FlexStyle['alignItems'];
    justifyContent?: FlexStyle['justifyContent'];
}


const propDefaults: Props = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
};


const AppView: React.FC<Props> = ({ children, ...restProps }) => {
    const { alignItems, justifyContent, flex } = { ...propDefaults, ...restProps };
    return (
        <View style={ { flex, alignItems, justifyContent } }>
            { children }
        </View>
    );
};
export default AppView;

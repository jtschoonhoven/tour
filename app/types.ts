import React from 'react';
import { NavigationScreenConfig, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';


// Utility type for navigation prop passed to components by react-navigation
export type ReactNavProp<NavParams = unknown> = NavigationScreenProp<unknown, NavParams>;

// Utility type that extends React.FC with the navigationOptions property expected by react-navigation
export interface ReactNavFC<Props = unknown, NavParams = unknown> extends React.FC<{ navigation: ReactNavProp<NavParams>} & Props> {
    navigationOptions?:
    | NavigationStackOptions
    | ((options: { navigation: ReactNavProp<NavParams> }) => NavigationStackOptions);
}

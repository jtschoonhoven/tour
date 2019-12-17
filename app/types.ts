import React from 'react';
import { NavigationScreenProp, NavigationState, NavigationNavigatorProps } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';


// Utility type for navigation prop passed to components by react-navigation
export type ReactNavProp<NavParams=unknown, NavState=unknown> = NavigationScreenProp<NavigationState & NavState, NavParams>;

// Utility type that extends React.FC with the navigationOptions property expected by react-navigation
export interface ReactNavFC<Props=unknown, NavParams=unknown, NavState=unknown> extends React.FC<NavigationNavigatorProps & { navigation: ReactNavProp<NavParams, NavState>} & Props> {
    navigationOptions?:
    | NavigationStackOptions
    | ((options: { navigation: ReactNavProp<NavParams> }) => NavigationStackOptions);
}

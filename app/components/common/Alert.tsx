import React from 'react';
import { Card, CardItem, H1 } from 'native-base';


interface Props extends React.PropsWithChildren<{}> {
    title: string;
}

const Alert: React.FC<Props> = ({ children, title }) => {
    const cardItems = React.Children.map(children, (child) => {
        return <CardItem bordered>{ child }</CardItem>;
    });
    return (
        <Card>
            <CardItem bordered header>
                <H1>{ title }</H1>
            </CardItem>
            { cardItems }
        </Card>
    );
};
export default Alert;

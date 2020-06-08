import React from 'react';
import { Text, Card, CardItem, Body } from 'native-base';
import { TourModel, CheckpointModel } from '../../store/tours-store';


interface Props {
    tour: TourModel;
    checkpoint: CheckpointModel;
}

const TourContent: React.FC<Props> = (props) => {
    const { checkpoint } = props;
    return (
        <Card>
            <CardItem header bordered>
                <Text style={ { fontSize: 20, fontWeight: 'bold' } }>
                    {checkpoint.name}
                </Text>
            </CardItem>
            <CardItem bordered>
                <Body>
                    <Text>{checkpoint.text} </Text>
                </Body>
            </CardItem>
        </Card>
    );
};
export default TourContent;

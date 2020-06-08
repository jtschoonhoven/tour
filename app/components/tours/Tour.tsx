import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';

import TourMap from './TourMap';
import TourContent from './TourContent';
import { AppState } from '../../store/store';
import { ReactNavFC } from '../../types';
import { TourModel } from '../../store/tours-store';
import { ROUTE_NAMES } from '../../constants';
import { NavProps } from './ModalTourComplete';
import actions from '../../store/actions';


export interface TourNavParams {
    title: string;
}


interface StateProps {
    tours: Array<TourModel>;
    tourIndex?: number;
    checkpointIndex?: number;
}

function mapStateToProps(state: AppState): StateProps {
    return {
        tourIndex: state.tours.currentTour?.toursIndex,
        checkpointIndex: state.tours.currentTour?.checkpointIndex,
        tours: state.tours.tours,
    };
}


const Tour: ReactNavFC<StateProps, TourNavParams> = (props) => {
    const { tourIndex, checkpointIndex, tours, navigation } = props;

    // Throw error if either tourIndex or checkpointIndex are undefined. This must be guarded against upstream.
    if (typeof tourIndex === 'undefined' || typeof checkpointIndex === 'undefined') {
        throw new Error(`Failed to render TourPreview with tour index ${tourIndex} and checkpoint ${checkpointIndex}.`);
    }

    const tour = tours[tourIndex];
    const checkpoint = tour.checkpoints[checkpointIndex];

    // Navigate to Tour Complete Modal if we've reached a dead end
    React.useEffect(() => {
        if (!checkpoint.linkIndices.length) {
            actions.tours.tourFinished(tourIndex);
            navigation.navigate<NavProps>(ROUTE_NAMES.MODAL_TOUR_COMPLETE, { title: tour.name });
        }
    }, [checkpointIndex]);

    return (
        <View style={ { flex: 1, flexDirection: 'column' } }>
            <View style={ { flex: 1 } }>
                <TourMap tour={ tour } checkpoint={ checkpoint } />
            </View>
            <ScrollView style={ { flex: 1 } }>
                <TourContent tour={ tour } checkpoint={ checkpoint } />
            </ScrollView>
        </View>
    );
};
Tour.navigationOptions = ({ navigation }): { title: string } => {
    return { title: navigation.getParam('title') };
};
export default connect(mapStateToProps)(Tour);

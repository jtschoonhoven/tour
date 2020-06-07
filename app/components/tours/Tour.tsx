import React from 'react';
import { connect } from 'react-redux';

import TourMap from './TourMap';
import { AppState } from '../../store/store';
import { ReactNavFC } from '../../types';
import { TourModel } from '../../store/tours-store';


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
    const { tourIndex, checkpointIndex, tours } = props;

    // Throw error if either tourIndex or checkpointIndex are undefined. This must be guarded against upstream.
    if (typeof tourIndex === 'undefined' || typeof checkpointIndex === 'undefined') {
        throw new Error(`Failed to render TourPreview with tour index ${tourIndex} and checkpoint ${checkpointIndex}.`);
    }

    const tour = tours[tourIndex];

    return (
        <TourMap tour={ tour } checkpointIndex={ checkpointIndex } />
    );
};
Tour.navigationOptions = ({ navigation }): { title: string } => {
    return { title: navigation.getParam('title') };
};
export default connect(mapStateToProps)(Tour);

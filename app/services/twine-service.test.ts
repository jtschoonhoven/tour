import twineService from './twine-service';
import geoTest from '../fixtures/tours/geo-test.json';
import { TourModel } from '../store/tours-store';


test('parseTwineToJsonExport geoTest fixture', () => {
    const parsed: TourModel = twineService.parseTwineToJsonExport(geoTest, 0);
    const expected: TourModel = {
        index: 0,
        name: 'GeoTest',
        schemaName: 'Harlowe 3 to JSON',
        schemaVersion: '0.0.6',
        uuid: 'A0472E68-7822-4211-9F11-5CBD919162DC',
        createdAtMs: 1591581091976,
        checkpoints: [
            {
                index: 0,
                name: 'The Journey Begins...',
                text: 'Quickly! Get to the safe zone before time runs out!',
                linkIndices: [1],
                geometries: [],
                markers: [],
            },
            {
                index: 1,
                name: 'The Journey Continues...',
                text: 'You made it to the checkpoint. Go to the finish point.',
                linkIndices: [2],
                geometries: [{
                    lat: 37.76483,
                    lng: -122.4455,
                    radius: 100,
                    type: 'geocircle',
                }],
                markers: [{
                    lat: 37.76483,
                    lng: -122.4455,
                    title: 'Safe Zone',
                    type: 'marker',
                }],
            },
            {
                index: 2,
                name: 'The End of Your Journey',
                text: 'The end. Or is it?!',
                linkIndices: [],
                geometries: [{
                    lat: 37.7677421,
                    lng: -122.44145,
                    radius: 100,
                    type: 'geocircle',
                }],
                markers: [{
                    lat: 37.7677421,
                    lng: -122.44145,
                    title: 'Finish',
                    type: 'marker',
                }],
            },
        ],
    };
    expect(parsed).toEqual(expected);
});

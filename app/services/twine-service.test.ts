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
        createdAtMs: 1586362589608,
        checkpoints: [
            {
                index: 0,
                name: 'start',
                text: 'Get to the choppa!',
                linkIndices: [1],
                geometries: [],
            },
            {
                index: 1,
                name: 'checkpoint',
                text: 'You made it to the checkpoint. Go to the finish point.',
                linkIndices: [2],
                geometries: [{
                    lat: 37.76483,
                    lng: -122.4455,
                    radius: 100,
                    type: 'geocircle',
                }],
            },
            {
                index: 2,
                name: 'finish',
                text: 'The end.',
                linkIndices: [],
                geometries: [{
                    lat: 37.7677421,
                    lng: -122.44145,
                    radius: 100,
                    type: 'geocircle',
                }],
            },
        ],
    };
    expect(parsed).toEqual(expected);
});

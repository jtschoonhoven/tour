import twineService from './twine-service';
import geoTest from '../fixtures/tours/geo-test.json';
import { TourModel } from '../store/tours-store';


test('parseTwineToJsonExport geoTest fixture', () => {
    const parsed: TourModel = twineService.parseTwineToJsonExport(geoTest);
    const expected: TourModel = {
        createdAtMs: 1586362589608,
        name: 'GeoTest',
        schemaName: 'Harlowe 3 to JSON',
        schemaVersion: '0.0.6',
        uuid: 'A0472E68-7822-4211-9F11-5CBD919162DC',
        checkpoints: [
            {
                geometries: [],
                name: 'start',
                text: 'Get to the choppa!',
                linkIndices: [1],
            },
            {
                geometries: [{
                    lat: 37.76483,
                    lng: -122.4455,
                    radius: 100,
                    type: 'geocircle',
                }],
                name: 'checkpoint',
                text: 'You made it to the checkpoint. Go to the finish point.',
                linkIndices: [2],
            },
            {
                geometries: [{
                    lat: 37.7677421,
                    lng: -122.44145,
                    radius: 100,
                    type: 'geocircle',
                }],
                name: 'finish',
                text: 'The end.',
                linkIndices: [],
            },
        ],
    };
    expect(parsed).toEqual(expected);
});

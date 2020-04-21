import { TwineToJsonExport } from '../../services/twine-service';

const geoTest: TwineToJsonExport = {
    'uuid': 'A0472E68-7822-4211-9F11-5CBD919162DC',
    'name': 'GeoTest',
    'creator': 'Twine',
    'creatorVersion': '2.3.6',
    'schemaName': 'Harlowe 3 to JSON',
    'schemaVersion': '0.0.6',
    'createdAtMs': 1586223109458,
    'passages': [
        {
            'name': 'start',
            'tags': '',
            'id': '1',
            'text': 'Get to the choppa!\n\n[[checkpoint]]',
            'links': [
                {
                    'linkText': 'checkpoint',
                    'passageName': 'checkpoint',
                    'original': '[[checkpoint]]',
                },
            ],
            'hooks': [],
            'cleanText': 'Get to the choppa!',
        },
        {
            'name': 'checkpoint',
            'tags': '',
            'id': '2',
            'text': 'You made it to the checkpoint. Go to the finish point.\n\n|geoCircle>[{ lat: 37.76483, lng: -122.4455, radius: 100 }]\n\n[[finish]]', // eslint-disable-line max-len
            'links': [
                {
                    'linkText': 'finish',
                    'passageName': 'finish',
                    'original': '[[finish]]',
                },
            ],
            'hooks': [
                {
                    'hookName': 'geoCircle',
                    'hookText': '{ lat: 37.76483, lng: -122.4455, radius: 100 }',
                    'original': '|geoCircle>[{ lat: 37.76483, lng: -122.4455, radius: 100 }]',
                },
            ],
            'cleanText': 'You made it to the checkpoint. Go to the finish point.',
        },
        {
            'name': 'finish',
            'tags': '',
            'id': '3',
            'text': 'The end.\n\n|geoCircle>[{ lat: 37.7677421, lng: -122.44145, radius: 100 }]',
            'links': [],
            'hooks': [
                {
                    'hookName': 'geoCircle',
                    'hookText': '{ lat: 37.7677421, lng: -122.44145, radius: 100 }',
                    'original': '|geoCircle>[{ lat: 37.7677421, lng: -122.44145, radius: 100 }]',
                },
            ],
            'cleanText': 'The end.',
        },
    ],
};
export default geoTest;

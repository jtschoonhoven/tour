import { CheckpointModel, GeoCircle, TourModel } from '../store/tours-store';


interface Hook {
    hookName: string;
    hookText: string;
    original: string;
}

interface Link {
    linkText: string;
    passageName: string;
    original: string;
}

interface Passage {
    name: string;
    tags: string;
    id: string;
    text: string;
    links: Array<Link>;
    hooks: Array<Hook>;
    cleanText: string;
}

export interface TwineToJsonExport {
    uuid: string;
    name: string;
    creator: string;
    creatorVersion: string;
    schemaName: string;
    schemaVersion: string;
    createdAtMs: number;
    passages: Array<Passage>;
}


function _parseJsonStringAsGeoCircle(jsonString: string): GeoCircle {
    try {
        // parse JSON from string
        const maybeGeoCircle = JSON.parse(jsonString);
        if (
            // type guard checks that parsed JSON includes properties from GeoCircle
            typeof (maybeGeoCircle as GeoCircle).lat === 'number'
            && typeof (maybeGeoCircle as GeoCircle).lng === 'number'
            && typeof (maybeGeoCircle as GeoCircle).radius === 'number'
        ) {
            const { lat, lng, radius } = maybeGeoCircle;
            return { type: 'geocircle', lat, lng, radius };
        }
    }
    catch (err) {
        throw new Error(`Failed to parse invalid json string as GeoCircle:\n${err.message}:\n${jsonString}`);
    }
    throw new Error(`Failed to create GeoCircle from JSON string with invalid properties:\n${jsonString}.`);
}


function _getGeometriesForPassage(passage: Passage): Array<GeoCircle> {
    const geoHooks = passage.hooks.filter((hook) => hook.hookName.toLowerCase() === 'geocircle');
    return geoHooks.map((geoHook) => _parseJsonStringAsGeoCircle(geoHook.hookText));
}


function _getLinkIndicesForPassage(passage: Passage, passages: Array<Passage>): Array<number> {
    return passage.links.map((link) => {
        const linkIndex = passages.findIndex((otherPassage) => otherPassage.name === link.passageName);
        if (linkIndex === -1) {
            throw new Error(`Failed to parse passsage "${passage.name}": broken link to passage ${link.passageName}`);
        }
        return linkIndex;
    });
}


function parseTwineToJsonExport(input: TwineToJsonExport): TourModel {
    const { uuid, name, schemaName, schemaVersion, createdAtMs, passages } = input;
    const checkpoints: Array<CheckpointModel> = passages.map((passage) => {
        return {
            name: passage.name,
            text: passage.cleanText,
            geometries: _getGeometriesForPassage(passage),
            linkIndices: _getLinkIndicesForPassage(passage, passages),
        };
    });
    return {
        uuid,
        name,
        schemaName,
        schemaVersion,
        createdAtMs,
        checkpoints,
    };
}


export default {
    parseTwineToJsonExport,
};

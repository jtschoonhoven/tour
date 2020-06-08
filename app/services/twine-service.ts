import { CheckpointModel, GeoCircle, TourModel, GeoMarker } from '../store/tours-store';


interface LatLng {
    lat: number;
    lng: number;
}

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


function _parseJsonStringAsGeoMarker(jsonString: string, defaultLatLng?: LatLng): GeoMarker {
    try {
        // parse JSON from string
        const maybeGeoMarker = JSON.parse(jsonString);
        if (typeof (maybeGeoMarker as GeoMarker).title === 'string') {
            if (
                typeof (maybeGeoMarker as GeoMarker).lat === 'number'
                && typeof (maybeGeoMarker as GeoMarker).lng === 'number'
            ) {
                const { lat, lng, title } = maybeGeoMarker;
                return { type: 'marker', lat, lng, title };
            }
            if (defaultLatLng) {
                return { type: 'marker', title: maybeGeoMarker.title, ...defaultLatLng };
            }
        }
    }
    catch (err) {
        throw new Error(`Failed to parse invalid json string as GeoMarker:\n${err.message}:\n${jsonString}`);
    }
    throw new Error(`Failed to create GeoMarker from JSON string with invalid properties:\n${jsonString}.`);
}


/**
 * Parse geometries in this passage to an array of geocircles.
 */
function _getGeometriesForPassage(passage: Passage): Array<GeoCircle> {
    const geoHooks = passage.hooks.filter((hook) => hook.hookName.toLowerCase() === 'geocircle');
    return geoHooks.map((geoHook) => _parseJsonStringAsGeoCircle(geoHook.hookText));
}


function _getMarkersForPassage(passage: Passage, geometries: Array<GeoCircle>): Array<GeoMarker> {
    const markerHooks = passage.hooks.filter((hook) => hook.hookName.toLowerCase() === 'marker');
    let latLng: LatLng;
    return markerHooks.map((markerHook, idx) => {
        if (idx < geometries.length) {
            latLng = { lat: geometries[idx].lat, lng: geometries[idx].lng };
        }
        return _parseJsonStringAsGeoMarker(markerHook.hookText, latLng);
    });
}


/**
 * Return an array of indices to other linked passages.
 */
function _getLinkIndicesForPassage(passage: Passage, passages: Array<Passage>): Array<number> {
    return passage.links.map((link) => {
        const linkIndex = passages.findIndex((otherPassage) => otherPassage.name === link.passageName);
        if (linkIndex === -1) {
            throw new Error(`Failed to parse passsage "${passage.name}": broken link to passage ${link.passageName}`);
        }
        return linkIndex;
    });
}


/**
 * Parse a Twine story export as a TourModel.
 */
function parseTwineToJsonExport(input: TwineToJsonExport, index: number): TourModel {
    const { uuid, name, schemaName, schemaVersion, createdAtMs, passages } = input;
    const checkpoints: Array<CheckpointModel> = passages.map((passage, passageIndex) => {
        const geometries = _getGeometriesForPassage(passage);
        const markers = _getMarkersForPassage(passage, geometries);
        const linkIndices = _getLinkIndicesForPassage(passage, passages);
        return {
            index: passageIndex,
            name: passage.name,
            text: passage.cleanText,
            geometries,
            markers,
            linkIndices,
        };
    });
    return {
        uuid,
        name,
        index,
        schemaName,
        schemaVersion,
        createdAtMs,
        checkpoints,
    };
}


export default {
    parseTwineToJsonExport,
};

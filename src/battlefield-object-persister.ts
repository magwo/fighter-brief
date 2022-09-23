import { BattlefieldObject, createBattlefieldObject, HeadingDegrees, Position, SpeedKnots } from "./battlefield-object";
import { decodeInt, decodePositions, encodePositions, encodeStringSafely, OBJECT_DELIMITER, PROPERTY_DELIMITER } from "./battlefield-object-encoding";
import { BattleFieldObjectType, CoalitionType, EndType, FormationType, MapType } from "./battlefield-object-types";

const CURRENT_VERSION = "v5";

interface LoadedData {
    scenarioName: string;
    mapBackground: string;
    loadedObjects: BattlefieldObject[];
    pan: Position;
    zoom: number;
}

export function loadData(data: string): LoadedData {
    const objectStrings: string[] = data.replace(/^#/, "").split(OBJECT_DELIMITER);

    const version = objectStrings[0];
    console.log("Data version is", version, "Loading...");
    if (version === "v1") {
        return decodeVersion1(data);
    } else if (version === "v2") {
        return decodeVersion2(data);
    } else if (version === "v3") {
        return decodeVersion3(data);
    } else if (version === "v4") {
        return decodeVersion4(data);
    } else if (version === "v5") {
        return decodeVersion5(data);
    } else {
        throw new Error(`Unknown data version "${version}", unable to load`);
    }
}

function decodeVersion5(data: string): LoadedData {
    const objectStrings: string[] = data.replace(/^#/, "").split(OBJECT_DELIMITER);
    const name = decodeURI(objectStrings[1]);
    const mapBackground = decodeURI(objectStrings[2]);
    const panX = Number(decodeURI(objectStrings[3]));
    const panY = Number(decodeURI(objectStrings[4]));
    const zoom = Number(decodeURI(objectStrings[5]));
    const reservedProperty = decodeURI(objectStrings[6]);
    const objects = objectStrings.slice(7).map((str) => {
        const tokens = str.split(PROPERTY_DELIMITER);
        let i = 0;
        const obj = createBattlefieldObject(
            tokens[i++],
            decodeURI(tokens[i++]),
            tokens[i++] as CoalitionType,
            tokens[i++] as BattleFieldObjectType,
            tokens[i++] === '' ? null : tokens[i - 1] as EndType,
            [Number(tokens[i++]), Number(tokens[i++])],
            Number(tokens[i++]) as HeadingDegrees,
            Number(tokens[i++]),
            Number(tokens[i++]) as SpeedKnots,
            Number(tokens[i++]),
            tokens[i++] as FormationType,
            tokens[i++] === '' ? null : Number(tokens[i - 1]),
        );
        obj.path.points = decodePositions(tokens[i++]);
        obj.path.refreshCurve();
        return obj;
    });

    return { scenarioName: name, mapBackground, loadedObjects: objects, pan: [panX, panY], zoom: zoom };
}

function decodeVersion4(data: string): LoadedData {
    // DO NOT CHANGE
    const objectStrings: string[] = data.replace(/^#/, "").split(OBJECT_DELIMITER);
    const name = decodeURI(objectStrings[1]);
    const mapBackground = decodeURI(objectStrings[2]);
    const objects = objectStrings.slice(7).map((str) => {
        const tokens = str.split(PROPERTY_DELIMITER);
        let i = 0;
        const obj = createBattlefieldObject(
            tokens[i++],
            decodeURI(tokens[i++]),
            tokens[i++] as CoalitionType,
            tokens[i++] as BattleFieldObjectType,
            tokens[i++] === '' ? null : tokens[i - 1] as EndType,
            [Number(tokens[i++]), Number(tokens[i++])],
            Number(tokens[i++]) as HeadingDegrees,
            Number(tokens[i++]),
            Number(tokens[i++]) as SpeedKnots,
            Number(tokens[i++]),
            tokens[i++] as FormationType,
            null,
        );
        obj.path.points = decodePositions(tokens[i++]);
        obj.path.refreshCurve();
        return obj;
    });

    return { scenarioName: name, mapBackground, loadedObjects: objects, pan: [0, 0], zoom: 1 };
}

function decodeVersion3(data: string): LoadedData {
    // DO NOT CHANGE
    const objectStrings: string[] = data.replace(/^#/, "").split(OBJECT_DELIMITER);
    const name = decodeURI(objectStrings[1]);
    const mapBackground = decodeURI(objectStrings[2]);
    const objects = objectStrings.slice(3).map((str) => {
        const tokens = str.split(PROPERTY_DELIMITER);
        let i = 0;
        const obj = createBattlefieldObject(
            tokens[i++],
            decodeURI(tokens[i++]),
            '',
            tokens[i++] as BattleFieldObjectType,
            tokens[i++] === '' ? null : tokens[i - 1] as EndType,
            [Number(tokens[i++]), Number(tokens[i++])],
            Number(tokens[i++]) as HeadingDegrees,
            Number(tokens[i++]),
            Number(tokens[i++]) as SpeedKnots,
            Number(tokens[i++]),
            tokens[i++] as FormationType,
            null,
        );
        obj.path.points = decodePositions(tokens[i++]);
        obj.path.refreshCurve();
        return obj;
    });

    return { scenarioName: name, mapBackground, loadedObjects: objects, pan: [0, 0], zoom: 1 };
}

function decodeVersion2(data: string): LoadedData {
    // DO NOT CHANGE
    const objectStrings: string[] = data.replace(/^#/, "").split(OBJECT_DELIMITER);
    const name = decodeURI(objectStrings[1]);
    const mapBackground = decodeURI(objectStrings[2]);
    const objects = objectStrings.slice(3).map((str) => {
        const tokens = str.split(PROPERTY_DELIMITER);
        let i = 0;
        const obj = createBattlefieldObject(
            tokens[i++],
            decodeURI(tokens[i++]),
            '',
            tokens[i++] as BattleFieldObjectType,
            tokens[i++] === '' ? null : tokens[i - 1] as EndType,
            [Number(tokens[i++]), Number(tokens[i++])],
            Number(tokens[i++]) as HeadingDegrees,
            Number(tokens[i++]),
            Number(tokens[i++]) as SpeedKnots,
            0,
            '' as FormationType,
            null,
        );
        obj.path.points = decodePositions(tokens[i++]);
        obj.path.refreshCurve();
        return obj;
    });

    return { scenarioName: name, mapBackground, loadedObjects: objects, pan: [0, 0], zoom: 1 };
    // DO NOT CHANGE
}

function decodeVersion1(data: string): LoadedData {
    // DO NOT CHANGE
    const objectStrings: string[] = data.replace(/^#/, "").split(";");
    const name = decodeURI(objectStrings[1]);
    const objects = objectStrings.slice(2).map((str) => {
        const tokens = str.split(",");
        let i = 0;
        const obj = createBattlefieldObject(
            tokens[i++],
            decodeURI(tokens[i++]),
            '',
            tokens[i++] as BattleFieldObjectType,
            tokens[i++] === '' ? null : tokens[i - 1] as EndType,
            [Number(tokens[i++]), Number(tokens[i++])],
            Number(tokens[i++]) as HeadingDegrees,
            Number(tokens[i++]),
            Number(tokens[i++]) as SpeedKnots,
            0,
            '' as FormationType,
            null,
        );
        for (; i < tokens.length - 1; i += 2) {
            obj.path.addPoint(decodeInt(tokens[i]), decodeInt(tokens[i + 1]));
        }
        return obj;
    });

    return { scenarioName: name, loadedObjects: objects, mapBackground: '', pan: [0, 0], zoom: 1 };
    // DO NOT CHANGE
}

export function serializeData(scenarioName: string, map: MapType, panX: number, panY: number, zoom: number, objects: BattlefieldObject[]): string {
    const version = CURRENT_VERSION;
    const name = encodeStringSafely(scenarioName);
    const reservedExtra = ''; // Reserved, not in use
    const prefixStrings = [
        version, 
        name, 
        map, 
        Math.round(panX), 
        Math.round(panY), 
        zoom.toFixed(2), 
        reservedExtra
    ];
    const objectStrings: string[] = objects.map((o) => {
        const propsStr = [
            o.id, 
            encodeStringSafely(o.name), 
            o.coalition, 
            o.type, 
            o.endType ?? '',
            Math.round(o.position[0]), 
            Math.round(o.position[1]), 
            Math.round(o.heading), 
            o.startTime.toFixed(3), 
            Math.round(o.speed),
            Math.round(o.wingmanCount),
            o.formation,
            o.duration ?? '',
        ].join(PROPERTY_DELIMITER);
        const pathPointsStr = encodePositions(o.path.points);
        return [propsStr, pathPointsStr].join(PROPERTY_DELIMITER);
    });
    return [...prefixStrings, ...objectStrings].join(OBJECT_DELIMITER);
}

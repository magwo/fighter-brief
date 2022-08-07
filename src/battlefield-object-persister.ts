import { BattlefieldObject, createBattlefieldObject, HeadingDegrees, SpeedKnots } from "./battlefield-object";
import { decodeInt, encodeInt, encodeStringSafely, OBJECT_DELIMITER } from "./battlefield-object-encoding";
import { BattleFieldObjectType, EndType } from "./battlefield-object-types";

// Reserved characters: ,;
// TODO: Stop using comma, or handle comma better

// TODO: Could use even better compression for shorter urls

const CURRENT_VERSION = "v1";


export function loadData(data: string): { scenarioName: string, loadedObjects: BattlefieldObject[] } {
    const objectStrings: string[] = data.replace(/^#/, "").split(OBJECT_DELIMITER);

    const version = objectStrings[0];
    console.log("Data version is", version, "Loading...");
    if (version === "v1") {
        return decodeVersion1(data);
    } else {
        throw new Error(`Unknown data version "${version}", unable to load`);
    }
}

function decodeVersion1(data: string): { scenarioName: string, loadedObjects: BattlefieldObject[] } {
    const objectStrings: string[] = data.split(";");
    const name = decodeURI(objectStrings[1]);
    const objects = objectStrings.slice(2).map((str) => {
        const tokens = str.split(",");
        let i = 0;
        const obj = createBattlefieldObject(
            tokens[i++],
            decodeURI(tokens[i++]),
            tokens[i++] as BattleFieldObjectType,
            tokens[i++] === '' ? null : tokens[i - 1] as EndType,
            [Number(tokens[i++]), Number(tokens[i++])],
            Number(tokens[i++]) as HeadingDegrees,
            Number(tokens[i++]),
            Number(tokens[i++]) as SpeedKnots
        );
        for (; i < tokens.length - 1; i += 2) {
            obj.path.addPoint(decodeInt(tokens[i]), decodeInt(tokens[i + 1]));
        }
        return obj;
    });

    return { scenarioName: name, loadedObjects: objects };
}

export function serializeData(objects: BattlefieldObject[]): string {
    const version = CURRENT_VERSION;
    const name = encodeStringSafely(''); // Scenario name, currently not used
    const prefixStrings = [version, name];
    const objectStrings: string[] = objects.map((o) => {
        const propsStr = [
            o.id, 
            encodeStringSafely(o.name), 
            o.type, 
            o.endType ? o.endType : '',
            Math.round(o.position[0]), 
            Math.round(o.position[1]), 
            Math.round(o.heading), 
            o.startTime.toFixed(3), 
            Math.round(o.speed)
        ].join(",");
        const pathPointsStr = o.path.points.map((p) => [encodeInt(p[0]), encodeInt(p[1])].join(",")).join(",");
        return [propsStr, pathPointsStr].join(",");
    });
    return [...prefixStrings, ...objectStrings].join(";");
}

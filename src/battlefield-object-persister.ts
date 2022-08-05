import { BattlefieldObject, createBattlefieldObject, HeadingDegrees, SpeedKnots } from "./battlefield-object";
import { BattleFieldObjectType, EndType } from "./battlefield-object-types";

// Reserved characters: ,;

// TODO: Write tests for this before optimizing
// TODO: Could use even better compression for shorter urls

function decodeInt(s: string): number {
    return Number.parseInt(s, 36);
}

function encodeInt(n: number) {
    return Math.round(n).toString(36);
}

export function loadObjects(data: string): BattlefieldObject[] {
    const objectStrings: string[] = data.replace(/^#/, "").split(";");

    const version = objectStrings[0];
    console.log("Data version is", version);
    const name = decodeURI(objectStrings[1]);
    console.log("Scenario name is", name);

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

    return objects;
}

export function serializeObjects(objects: BattlefieldObject[]): string {
    const version = "v1";
    const name = encodeURI(''); // Scenario name, currently not used
    const prefixStrings = [version, name];
    const objectStrings: string[] = objects.map((o) => {
        const propsStr = [
            o.id, 
            encodeURI(o.name), 
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

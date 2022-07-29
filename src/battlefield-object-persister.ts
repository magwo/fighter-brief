import { BattlefieldObject, Heading, Position, Speed } from "./battlefield-object";
import { AircraftType } from "./battlefield-object-types";

// Reserved characters: ,;

export function loadObjects(data: string): BattlefieldObject[] {
    const objectStrings: string[] = data.split(";");

    const objects = objectStrings.map((str) => {
        const tokens = str.split(",");
        let i = 0;
        const obj = new BattlefieldObject(
            tokens[i++],
            tokens[i++],
            tokens[i++] as AircraftType,
            new Position(Number(tokens[i++]), Number(tokens[i++])),
            new Heading(Number(tokens[i++])),
            new Speed(Number(tokens[i++]))
        );
        for (; i < tokens.length - 1; i += 2) {
            obj.path.addPoint(Number(tokens[i]), Number(tokens[i + 1]));
        }
        return obj;
    });

    return objects;
}

export function serializeObjects(objects: BattlefieldObject[]): string {
    const objectStrings: string[] = objects.map((o) => {
        const propsStr = [
            o.id, 
            o.name, 
            o.type, 
            Math.round(o.position.x), 
            Math.round(o.position.y), 
            Math.round(o.heading.heading), 
            Math.round(o.speed.metersPerSecond)
        ].join(",");
        const pathPointsStr = o.path.points.map((p) => [Math.round(p.x), Math.round(p.y)].join(",")).join(",");
        return [propsStr, pathPointsStr].join(",");
    });
    return objectStrings.join(";");
}

import { AircraftType, BattleFieldObjectType, EndType, InfoType, ShipType, StaticType, WeaponType } from "./battlefield-object-types";
import { CurveInterpolator2D, simplify2d } from 'curve-interpolator';

export class Position {
    constructor(public x: number, public y: number) {

    }
}

export class Heading {
    constructor(public heading: number) {

    }
}

export class Speed {
    constructor(public metersPerSecond: number) {
    }

    get pixelsPerSecond(): number {
        return this.metersPerSecond * 0.4;
    }

    static fromKnots(knots: number) {
        return new Speed(knots * 0.51444);
    }
}

export class Path {
    // Consider switching to array coordinates for performance
    points: Position[] = [];
    curve: any;

    considerAddingPoint(x: number, y: number) {
        const dx = x - this.points[this.points.length - 1].x;
        const dy = y - this.points[this.points.length - 1].y;
        const lenSqrd = dx * dx + dy * dy;
        if (lenSqrd > 10 * 10) {

            if (this.points.length >= 2) {
                // Angular snapping
                const pLast = this.points[this.points.length - 1];
                const pPrev = this.points[this.points.length - 2];
                const prevAngle = Math.atan2(pLast.y - pPrev.y, pLast.x - pPrev.x);
                let newAngle = Math.atan2(dy, dx);
                if (Math.abs(newAngle - prevAngle) < 0.1) {
                    newAngle = prevAngle;
                }
                const len = Math.sqrt(lenSqrd);
                x = pLast.x + len * Math.cos(newAngle);
                y = pLast.y + len * Math.sin(newAngle);
            }

            this.addPoint(x, y);
        }
    }

    addPoint(x: number, y: number) {
        // TODO: Could try angular snap and angular delta-max
        this.points.push(new Position(x, y));
        this.refreshCurve();
    }

    refreshCurve() {
        let curvePoints = this.points.map((p) => [p.x, p.y]);
        curvePoints = simplify2d(curvePoints, 10, 20);
        this.curve = new CurveInterpolator2D(curvePoints, 0.001, undefined, false);
    }

    getPositionAlongCurveNorm(fraction: number): Position {
        const point = this.curve.getPointAt(fraction);
        return new Position(point[0], point[1]);
    }

    getHeadingAlongCurveNorm(fraction: number): number {
        const tangent = this.curve.getTangentAt(fraction);
        const angle = Math.atan2(tangent[1], tangent[0]);
        return 90 + angle * 360 / (Math.PI * 2);
    }

    getStopTime(startTime: number, speed: Speed): number {
        const travelTime = this.curve.length / speed.pixelsPerSecond;
        return startTime + travelTime;

    }
}

const getRandomId = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 36).toString(36)).join('');

export interface BattlefieldObject {
    id: string;
    name: string;
    type: BattleFieldObjectType;
    endType: EndType;
    position: Position;
    heading: Heading;
    startTime: number;
    speed: Speed;
    path: Path;
    isVisible: boolean;
    hasReachedEnd: boolean;
}

export function createBattlefieldObject(id: string | null, name: string, type: AircraftType | ShipType | StaticType | WeaponType | InfoType, endType: EndType, position: Position, heading: Heading, startTime: number, speed: Speed): BattlefieldObject {
    if (id === null) {
        id = getRandomId(8);
    }
    return {
        id,
        name,
        type,
        endType,
        position,
        heading,
        startTime,
        speed,
        path: new Path(),
        isVisible: false,
        hasReachedEnd: false,
    }
}


export function update(obj: BattlefieldObject, timeSeconds: number) {
    obj.isVisible = timeSeconds >= obj.startTime;
    obj.hasReachedEnd = timeSeconds >= getStopTime(obj);
    if (obj.path.points.length > 0) {
        obj.position = getPositionAlongCurve(obj, timeSeconds);
        obj.heading.heading = getHeadingAlongCurve(obj, timeSeconds);
    }
}

export function getPositionAlongCurve(obj: BattlefieldObject, time: number): Position {
    if (obj.path.curve.length > 0) {
        const stopTime = getStopTime(obj);
        let normalizedTime = (time - obj.startTime) / (stopTime - obj.startTime);
        normalizedTime = Math.max(0, Math.min(1, normalizedTime));
        return obj.path.getPositionAlongCurveNorm(normalizedTime);
    } else {
        return obj.position;
    }
}

export function getHeadingAlongCurve(obj: BattlefieldObject, time: number): number {
    if (obj.path.curve.length > 0) {
        const stopTime = getStopTime(obj);
        let normalizedTime = (time - obj.startTime) / (stopTime - obj.startTime);
        normalizedTime = Math.max(0, Math.min(1, normalizedTime));
        return obj.path.getHeadingAlongCurveNorm(normalizedTime);
    } else {
        return obj.heading.heading;
    }
}

export function getStopTime(obj: BattlefieldObject) {
    if (obj.path.points.length > 0) {
        return obj.path.getStopTime(obj.startTime, obj.speed);
    } else {
        return obj.startTime;
    }
}
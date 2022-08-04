import { BattleFieldObjectType, EndType } from "./battlefield-object-types";
import { CurveInterpolator2D, simplify2d } from 'curve-interpolator';

export type Position = [number, number];

export type HeadingDegrees = number;
export type SpeedKnots = number;
const SPEED_PIXEL_FACTOR = 0.22;

export type PathCreationMode = 'normal' | 'fly_cardinals' | 'fly_straight' | 'fly_smooth';

export class Path {
    // Consider switching to array coordinates for performance
    points: Position[] = [];
    curve: any;

    considerAddingPoint(x: number, y: number, pathMode: PathCreationMode) {
        const dx = x - this.points[this.points.length - 1][0];
        const dy = y - this.points[this.points.length - 1][1];
        // TODO: Need to first project on stuff with special modes
        const lenSqrd = dx * dx + dy * dy;
        if (lenSqrd > 20 * 20) {
            if (pathMode === 'fly_cardinals' && this.points.length > 0) {
                console.log("Cardinals");
                if (Math.abs(dx) > Math.abs(dy)) {
                    y = this.points[this.points.length - 1][1];
                } else {
                    x = this.points[this.points.length - 1][0];
                }
            } else if(pathMode === 'fly_straight' && this.points.length > 1) {
                console.log("Straight");
                const numP = this.points.length;
                const len = Math.sqrt(lenSqrd);
                const prevDx = this.points[numP - 1][0] - this.points[numP - 2][0]
                const prevDy = this.points[numP - 1][1] - this.points[numP - 2][1]
                const prevAngle = Math.atan2(prevDy, prevDx);

                // TODO: Fix up
                x = this.points[numP - 1][0] + len * Math.cos(prevAngle);
                y = this.points[numP - 1][1] + len * Math.sin(prevAngle);
            } else if(pathMode === 'fly_smooth' && this.points.length > 1) {
                console.log("Smooth");
                const numP = this.points.length;
                const len = Math.sqrt(lenSqrd);
                const prevDx = this.points[numP - 1][0] - this.points[numP - 2][0]
                const prevDy = this.points[numP - 1][1] - this.points[numP - 2][1]
                const prevAngle = Math.PI*2 + Math.atan2(prevDy, prevDx);
                let newAngle = Math.PI*2 + Math.atan2(dy, dx);
                
                const maxAngleChange = len * 0.001; // Magic number. TODO: Base upon speed and/or turn radius
                console.log("New angle", newAngle);
                console.log("Prev angle", prevAngle);
                if (newAngle - prevAngle > maxAngleChange) {
                    newAngle = prevAngle + maxAngleChange;
                } else if(newAngle - prevAngle < -maxAngleChange) {
                    newAngle = prevAngle - maxAngleChange;
                }

                // TODO: Fix up

                x = this.points[numP - 1][0] + len * Math.cos(newAngle);
                y = this.points[numP - 1][1] + len * Math.sin(newAngle);
            }
            this.addPoint(x, y);
        }
    }
    setPoints(points: Position[]) {
        this.points = [...points];
        this.refreshCurve();
    }

    addPoint(x: number, y: number) {
        // TODO: Could try angular snap and angular delta-max
        this.points.push([x, y]);
        this.refreshCurve();
    }

    refreshCurve() {
        const curvePoints = simplify2d(this.points, 10, 20);
        this.curve = new CurveInterpolator2D(curvePoints, 0.001, undefined, false);
    }

    getPositionAlongCurveNorm(fraction: number): Position {
        const point = this.curve.getPointAt(fraction);
        return [point[0], point[1]];
    }

    getHeadingAlongCurveNorm(fraction: number): number {
        // TODO: Experiment with getting smoothed tangent - before and after current point
        const tangent = this.curve.getTangentAt(fraction);
        const angle = Math.atan2(tangent[1], tangent[0]);
        return 90 + angle * 360 / (Math.PI * 2);
    }

    getStopTime(startTime: number, speed: SpeedKnots): number {
        const travelTime = this.curve.length / (speed * SPEED_PIXEL_FACTOR);
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
    heading: HeadingDegrees;
    startTime: number;
    speed: SpeedKnots;
    path: Path;
    isVisible: boolean;
    hasReachedEnd: boolean;
}

export function createBattlefieldObject(id: string | null, name: string, type: BattleFieldObjectType, endType: EndType, position: Position, heading: HeadingDegrees, startTime: number, speed: SpeedKnots): BattlefieldObject {
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
    // For some reason curve will throw exception if using less than 3 points
    if (obj.path.points.length > 2) {
        obj.position = getPositionAlongCurve(obj, timeSeconds);
        obj.heading = getHeadingAlongCurve(obj, timeSeconds);
    }
}

export function getPositionAlongCurve(obj: BattlefieldObject, time: number): Position {
    if (obj.path.points.length > 2) {
        const stopTime = getStopTime(obj);
        let normalizedTime = (time - obj.startTime) / (stopTime - obj.startTime);
        normalizedTime = Math.max(0, Math.min(1, normalizedTime));
        return obj.path.getPositionAlongCurveNorm(normalizedTime);
    } else {
        return obj.position;
    }
}

export function getHeadingAlongCurve(obj: BattlefieldObject, time: number): HeadingDegrees {
    if (obj.path.points.length > 2) {
        const stopTime = getStopTime(obj);
        let normalizedTime = (time - obj.startTime) / (stopTime - obj.startTime);
        normalizedTime = Math.max(0, Math.min(1, normalizedTime));
        return obj.path.getHeadingAlongCurveNorm(normalizedTime);
    } else {
        return obj.heading;
    }
}

export function getStopTime(obj: BattlefieldObject) {
    if (obj.path.points.length > 2) {
        return obj.path.getStopTime(obj.startTime, obj.speed);
    } else {
        return obj.startTime;
    }
}
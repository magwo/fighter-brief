import { BattleFieldObjectType, CoalitionType, EndType, FormationType } from "./battlefield-object-types";
import { CurveInterpolator2D, simplify2d } from 'curve-interpolator';

const TWO_PI = Math.PI * 2;
export type Position = [number, number];
export class PositionMath {

    static readonly KM_PER_NM = 1.852;
    static readonly PIXELS_PER_KM = 4.433369156;
    
    private constructor() {}
    static length2D(p: Position) {
        return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
    }
    static add(p1: Position, p2: Position): Position {
        return [p1[0] + p2[0], p1[1] + p2[1]];
    }
    static delta(p1: Position, p0: Position): Position {
        return [p1[0] - p0[0], p1[1] - p0[1]];
    }
    static angle(vector: Position): number {
        return Math.atan2(vector[1], vector[0]);
    }
    static heading(vector: Position): number {
        const angle = Math.atan2(vector[1], vector[0]);
        return 90 + angle * 360 / TWO_PI;
    }
    static headingFromAngle(angleRadians: number): number {
        return 90 + angleRadians * 360 / TWO_PI;
    }
    static angleFromHeading(headingDegrees: number): number {
        return (headingDegrees - 90) * (TWO_PI / 360);
    }
    static normalize(vector: Position): Position {
        const len = PositionMath.length2D(vector);
        return [vector[0] / len, vector[1] / len];
    }
    static toLength(vector: Position, length: number): Position {
        const currentLen = PositionMath.length2D(vector);
        return [length * vector[0] / currentLen, length * vector[1] / currentLen];
    }
    static dotProduct(vector1: Position, vector2: Position): number {
        return vector1[0] * vector2[0] + vector1[1] * vector2[1];
    }
    static projectOn(vector: Position, targetVector: Position): Position {
        const dotProduct = PositionMath.dotProduct(vector, targetVector);
        const targetLenSqrd = PositionMath.dotProduct(targetVector, targetVector);
        const factor = dotProduct / targetLenSqrd;
        return [targetVector[0] * factor, targetVector[1] * factor];
    }

    static getNmFromPixelDistance(distancePixels: number) {
        return distancePixels / (PositionMath.PIXELS_PER_KM * PositionMath.KM_PER_NM);
    }

    static getDistanceKm(pixelPos1: Position, pixelPos2: Position) {
        return PositionMath.length2D(PositionMath.delta(pixelPos2, pixelPos1)) / PositionMath.PIXELS_PER_KM;
    };

    static getDistanceNm(pixelPos1: Position, pixelPos2: Position) {
        return PositionMath.getDistanceKm(pixelPos1, pixelPos2) / PositionMath.KM_PER_NM;
    };

    static makeAngleWorkable(angle: number) {
        return ((angle + TWO_PI) % TWO_PI) + TWO_PI;
    }
}
(window as any).PositionMath = PositionMath;

export type HeadingDegrees = number;
export type SpeedKnots = number;

export type PathCreationMode = 'normal' | 'fly_cardinals' | 'fly_straight' | 'fly_smooth';

export class Path {
    points: Position[] = [];
    curve: any;

    considerAddingPoint(x: number, y: number, pathMode: PathCreationMode, smoothness: number | undefined) {
        const prevPoint = this.points[this.points.length - 1];
        const delta = PositionMath.delta([x, y], prevPoint);
        const len = PositionMath.length2D(delta);
        const MIN_DISTANCE = 20;
        
        if ((pathMode === 'normal' || this.points.length < 2) && len > MIN_DISTANCE) {
            this.addPoint(x, y);
        }
        else if (pathMode === 'fly_cardinals' && this.points.length > 0) {
            // Currently not working correctly
            console.log("Cardinals");
            if (Math.abs(delta[0]) > Math.abs(delta[1])) {
                y = this.points[this.points.length - 1][1];
            } else {
                x = this.points[this.points.length - 1][0];
            }
        } else if(pathMode === 'fly_straight' && this.points.length > 1) {
            const prevPrevPoint = this.points[this.points.length - 2];
            const prevDelta = PositionMath.delta(prevPoint, prevPrevPoint);

            const projected = PositionMath.projectOn(delta, prevDelta);
            const projectedLen = PositionMath.length2D(projected);

            const isCorrectDirection = PositionMath.dotProduct(delta, prevDelta) > 0;

            if (projectedLen > MIN_DISTANCE && isCorrectDirection) {
                this.addPoint(prevPoint[0] + projected[0], prevPoint[1] + projected[1]);
            }
        } else if(pathMode === 'fly_smooth' && this.points.length > 1) {
            const prevPrevPoint = this.points[this.points.length - 2];
            const prevDelta = PositionMath.delta(prevPoint, prevPrevPoint);
            // TODO: Are these workable calls needed?
            let prevAngle = PositionMath.makeAngleWorkable(PositionMath.angle(prevDelta));
            let newAngle = PositionMath.makeAngleWorkable(PositionMath.angle(delta));
            
            // const maxAngleChange = len * 0.01; // Magic number. TODO: Base upon speed and/or turn radius

            if (prevAngle < newAngle - Math.PI) {
                prevAngle += Math.PI * 2;
            }
            if (prevAngle > newAngle + Math.PI) {
                prevAngle -= Math.PI * 2;
            }
            smoothness = smoothness ?? 0.7;
            newAngle = prevAngle * smoothness + newAngle * (1.0 - smoothness);

            const newVector: Position = [len * Math.cos(newAngle), len * Math.sin(newAngle)];
            let projected = PositionMath.projectOn(delta, newVector);
            const projectedLen = PositionMath.length2D(projected);
            const isCorrectDirection = PositionMath.dotProduct(delta, prevDelta) > 0;

            if (projectedLen > MIN_DISTANCE && isCorrectDirection) {
                if (projectedLen > 2 * MIN_DISTANCE) {
                    projected = PositionMath.toLength(projected, MIN_DISTANCE * 2);
                }
                this.addPoint(prevPoint[0] + projected[0], prevPoint[1] + projected[1]);
            }
    
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
        const distanceNm = PositionMath.getNmFromPixelDistance(this.curve.length);
        const travelTimeHrs = distanceNm / speed;
        const travelTimeSecs = travelTimeHrs * 60 * 60;
        return startTime + travelTimeSecs;
    }
}

export const getRandomId = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 36).toString(36)).join('');

export interface BattlefieldObject {
    // TODO: Maybe stop using mutating objects?
    id: string;
    name: string;
    coalition: CoalitionType;
    type: BattleFieldObjectType;
    endType: EndType;
    position: Position;
    heading: HeadingDegrees;
    startTime: number;
    speed: SpeedKnots;
    wingmanCount: number;
    formation: FormationType;
    path: Path;
    duration: number | null;
    isVisible: boolean;
    hasReachedEnd: boolean;
}

export function createBattlefieldObject(id: string | null, name: string, coalition: CoalitionType, type: BattleFieldObjectType, endType: EndType, position: Position, heading: HeadingDegrees, startTime: number, speed: SpeedKnots, wingmanCount: number, formation: FormationType, duration: number | null): BattlefieldObject {
    if (id === null) {
        id = getRandomId(8);
    }
    return {
        id,
        name,
        coalition,
        type,
        endType,
        position,
        heading,
        startTime,
        speed,
        wingmanCount,
        formation,
        path: new Path(),
        duration: duration,
        isVisible: false,
        hasReachedEnd: false,
    }
}


export function update(obj: BattlefieldObject, timeSeconds: number) {
    obj.isVisible = timeSeconds >= obj.startTime && timeSeconds <= (obj.startTime + (obj.duration ?? Number.MAX_SAFE_INTEGER));
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
import { AircraftType, ShipType, StaticType, WeaponType } from "./battlefield-object-types";
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
export class BattlefieldObject {
    public path: Path = new Path();
    public isVisible = false;



    constructor(public id: string | null, public name: string, public type: AircraftType | ShipType | StaticType | WeaponType, public position: Position, public heading: Heading, public startTime: number, public speed: Speed) {
        if (this.id === null) {
            this.id = getRandomId(8);
        }
    }

    update(dtSeconds: number, timeSeconds: number) {
        this.isVisible = timeSeconds >= this.startTime;
        if (this.path.points.length > 0) {
            this.position = this.getPositionAlongCurve(timeSeconds);
            this.heading.heading = this.getHeadingAlongCurve(timeSeconds);
        } else {
            const vx = this.speed.metersPerSecond * Math.cos((this.heading.heading - 90) * (Math.PI*2/360));
            const vy = this.speed.metersPerSecond * Math.sin((this.heading.heading - 90) * (Math.PI*2/360));
            this.position.x += vx * dtSeconds;
            this.position.y += vy * dtSeconds;
        }
    }

    getPositionAlongCurve(time: number): Position {
        if (this.path.curve.length > 0) {
            const stopTime = this.getStopTime();
            let normalizedTime = (time - this.startTime) / (stopTime - this.startTime);
            normalizedTime = Math.max(0, Math.min(1, normalizedTime));
            return this.path.getPositionAlongCurveNorm(normalizedTime);
        } else {
            return this.position;
        }
    }

    getHeadingAlongCurve(time: number): number {
        if (this.path.curve.length > 0) {
            const stopTime = this.getStopTime();
            let normalizedTime = (time - this.startTime) / (stopTime - this.startTime);
            normalizedTime = Math.max(0, Math.min(1, normalizedTime));
            return this.path.getHeadingAlongCurveNorm(normalizedTime);
        } else {
            return this.heading.heading;
        }
    }

    getStopTime() {
        if (this.path.points.length > 0) {
            return this.path.getStopTime(this.startTime, this.speed);
        } else {
            return this.startTime;
        }
    }
}
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
}

export class Path {
    // Consider switching to array coordinates for performance
    points: {time: number, pos: Position}[] = [];
    curve: any;

    considerAddingPoint(time: number, x: number, y: number) {
        const dx = x - this.points[this.points.length - 1].pos.x;
        const dy = y - this.points[this.points.length - 1].pos.y;
        const lenSqrd = dx * dx + dy * dy;
        if (lenSqrd > 10 * 10) {
            this.addPoint(time, x, y);
        }
    }

    addPoint(time: number, x: number, y: number) {
        // TODO: Could try angular snap and angular delta-max
        this.points.push({time: time, pos: new Position(x, y)});
        this.refreshCurve();
    }

    refreshCurve() {
        let curvePoints = this.points.map((p) => [p.pos.x, p.pos.y]);
        // console.log("Curve points", curvePoints);
        curvePoints = simplify2d(curvePoints, 10, 20);
        // console.log("Curve after simplify", curvePoints)
        this.curve = new CurveInterpolator2D(curvePoints, 0.001, undefined, false);
        // console.log(this.curve.getPointAt(0));
    }

    getPositionAlongCurve(time: number, speed: Speed): Position {
        // TODO: Consider speed
        const point = this.curve.getPointAt(time);
        return new Position(point[0], point[1]);
    }
    getPositionAlongCurveNorm(fraction: number) {
        const point = this.curve.getPointAt(fraction);
        return new Position(point[0], point[1]);
    }

    getHeadingAlongCurve(time: number, speed: Speed): number {
        // TODO: Consider speed
        const tangent = this.curve.getTangentAt(time);
        const angle = Math.atan2(tangent[1], tangent[0]);
        return 90 + angle * 360 / (Math.PI * 2);
    }

    getHeadingAlongCurveNorm(fraction: number): number {
        const tangent = this.curve.getTangentAt(fraction);
        const angle = Math.atan2(tangent[1], tangent[0]);
        return 90 + angle * 360 / (Math.PI * 2);
    }
}


const getRandomId = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 36).toString(36)).join('');
export class BattlefieldObject {
    public path: Path = new Path();

    constructor(public id: string | null, public name: string, public type: AircraftType | ShipType | StaticType | WeaponType, public position: Position, public heading: Heading, public speed: Speed) {
        if (this.id === null) {
            this.id = getRandomId(8);
        }
    }

    update(dtSeconds: number, timeSeconds: number) {
        if (this.path.points.length > 0) {
            const localPathTime = Math.max(0, Math.min(1, timeSeconds / 10));
            this.position = this.path.getPositionAlongCurve(localPathTime, this.speed);
            this.heading.heading = this.path.getHeadingAlongCurve(localPathTime, this.speed);
        } else {
            const vx = this.speed.metersPerSecond * Math.cos((this.heading.heading - 90) * (Math.PI*2/360));
            const vy = this.speed.metersPerSecond * Math.sin((this.heading.heading - 90) * (Math.PI*2/360));
            this.position.x += vx * dtSeconds;
            this.position.y += vy * dtSeconds;
        }
    }
}
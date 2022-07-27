import { AircraftType, ShipType, StaticType, WeaponType } from "./battlefield-object-types";

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

let nextId = 0;
export class BattlefieldObject {
    public id: string;
    constructor(public name: string, public type: AircraftType | ShipType | StaticType | WeaponType, public position: Position, public heading: Heading, public speed: Speed) {
        this.id = 'battlefield-object-' + nextId;
        nextId++;
    }

    update(dtSeconds: number) {
        const vx = this.speed.metersPerSecond * Math.cos((this.heading.heading - 90) * (Math.PI*2/360));
        const vy = this.speed.metersPerSecond * Math.sin((this.heading.heading - 90) * (Math.PI*2/360));

        this.position.x += vx * dtSeconds;
        this.position.y += vy * dtSeconds;

        // console.log(this.position, this.heading);
    }
}
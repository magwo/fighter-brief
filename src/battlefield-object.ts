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
    // TODO: Typing for type?
    constructor(public name: string, public type: AircraftType | ShipType | StaticType | WeaponType, public position: Position, public heading: Heading, public speed: Speed) {
        this.id = 'battlefield-object-' + nextId;
        nextId++;
    }
}
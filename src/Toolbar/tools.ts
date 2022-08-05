import { AirplaneType, EndType, GroundType, HelicopterType, ShipType, StaticType, WeaponType } from '../battlefield-object-types';

export interface PlaceMovableTool {
    toolType: 'placeMovable';
    objectType: AirplaneType | HelicopterType | ShipType | GroundType | WeaponType;
    speedKnots: number;
    pathSmoothness?: number | undefined,
    endType?: EndType | null;
}

export interface PlaceStaticTool {
    toolType: 'placeStatic';
    objectType: StaticType;
}

export interface DeleteTool {
    toolType: 'delete';
}

export interface ResetTool {
    toolType: 'reset';
}

export interface PlaceLabelTool {
    toolType: 'placeLabel';
}

export interface PlaceMeasurementTool {
    toolType: 'placeMeasurement';
}
export interface SelectTool {
    toolType: 'select';
}

export type Tool = PlaceMovableTool | PlaceStaticTool | DeleteTool | ResetTool | PlaceLabelTool | PlaceMeasurementTool | SelectTool;

export const toolCategories: { categoryName: string, showAlways: boolean, tools: Tool[] }[] = [
    {
        categoryName: 'General',
        showAlways: true,
        tools: [
            { toolType: 'select' },
            { toolType: 'delete' },
            { toolType: 'placeLabel' },
            { toolType: 'placeMeasurement' },
            // { toolType: 'reset' },
        ]
    },
    {
        categoryName: 'Fast Jets',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'viper', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'hornet', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'viggen', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'tomcat', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'warthog', speedKnots: 200 },
            { toolType: 'placeMovable', objectType: 'albatros', speedKnots: 200 },
            { toolType: 'placeMovable', objectType: 'fishbed', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'flanker', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'gripen', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'thunder', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'tiger', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'harrier', speedKnots: 400 },
        ]
    },
    {
        categoryName: 'Heavies',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'awacs', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'blackjack', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'hercules', speedKnots: 200 },
            { toolType: 'placeMovable', objectType: 'lancer', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'stratofortress', speedKnots: 400 },
            { toolType: 'placeMovable', objectType: 'tanker', speedKnots: 400 },
        ]
    },
    {
        categoryName: 'Helicopters',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'apache', speedKnots: 150, pathSmoothness: 0.2 },
            { toolType: 'placeMovable', objectType: 'hind', speedKnots: 150, pathSmoothness: 0.2 },
            { toolType: 'placeMovable', objectType: 'huey', speedKnots: 100, pathSmoothness: 0.2 },
        ]
    },
    {
        categoryName: 'Weapons',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'mk82', speedKnots: 300, endType: 'expl_m', pathSmoothness: 0.8 },
            { toolType: 'placeMovable', objectType: 'amraam', speedKnots: 1000, endType: 'expl_m', pathSmoothness: 0.5 },
            { toolType: 'placeMovable', objectType: 'sidewinder', speedKnots: 1000, endType: 'expl_m', pathSmoothness: 0.3 },
            { toolType: 'placeMovable', objectType: 'harm', speedKnots: 1000, endType: 'expl_m', pathSmoothness: 0.7 },
        ]
    },
    {
        categoryName: 'Ships',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'carrier', speedKnots: 30, pathSmoothness: 0.5 },
            { toolType: 'placeMovable', objectType: 'cruiser', speedKnots: 30, pathSmoothness: 0.5 },
        ]
    },
    {
        categoryName: 'Ground',
        showAlways: false,
        tools: [
            // { toolType: 'placeMovable', objectType: 'infantry', speedKnots: 10 },
            { toolType: 'placeMovable', objectType: 'apc', speedKnots: 50, pathSmoothness: 0.15 },
            { toolType: 'placeMovable', objectType: 'tank', speedKnots: 50, pathSmoothness: 0.15 },
            { toolType: 'placeMovable', objectType: 'truck', speedKnots: 50, pathSmoothness: 0.15 },
            { toolType: 'placeMovable', objectType: 'manpad', speedKnots: 10, pathSmoothness: 0.05 },
            { toolType: 'placeMovable', objectType: 'mobilesam', speedKnots: 50, pathSmoothness: 0.15 },
        ]
    },
    {
        categoryName: 'Installations',
        showAlways: false,
        tools: [
            { toolType: 'placeStatic', objectType: 'bullseye', },
            { toolType: 'placeStatic', objectType: 'airfield', },
            { toolType: 'placeStatic', objectType: 'bridge', },
            { toolType: 'placeStatic', objectType: 'aaa', },
            { toolType: 'placeStatic', objectType: 'samsite', },
        ]
    },
];
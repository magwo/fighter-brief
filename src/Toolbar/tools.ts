import { AirplaneType, EndType, GroundType, HelicopterType, MeasurementSubType, ShipType, StaticType, WeaponType } from '../battlefield-object-types';

type ToolType = 'placeMovable' | 'placeStatic' | 'delete' | 'reset' | 'select' | 'placeLabel' | 'placeMeasurement';

const PLACE_MOVABLE: ToolType = 'placeMovable'
export interface PlaceMovableTool {
    toolType: typeof PLACE_MOVABLE;
    objectType: AirplaneType | HelicopterType | ShipType | GroundType | WeaponType;
    speedKnots: number;
    label: string;
    pathSmoothness?: number | undefined;
    endType?: EndType | null;
}

const PLACE_STATIC: ToolType = 'placeStatic'
export interface PlaceStaticTool {
    toolType: typeof PLACE_STATIC;
    label: string;
    objectType: StaticType;
}

const DELETE: ToolType = 'delete'
export interface DeleteTool {
    toolType: typeof DELETE;
    label: string;
}

const RESET: ToolType = 'reset'
export interface ResetTool {
    toolType: typeof RESET;
    label: string;
}

const PLACE_LABEL: ToolType = 'placeLabel'
export interface PlaceLabelTool {
    toolType: typeof PLACE_LABEL;
    label: string;
}

const PLACE_MEASUREMENT: ToolType = 'placeMeasurement'
export interface PlaceMeasurementTool {
    toolType: typeof PLACE_MEASUREMENT;
    label: string;
    title: string;
    subType: MeasurementSubType;
}

const SELECT: ToolType = 'select'
export interface SelectTool {
    toolType: typeof SELECT;
    label: string;
}

export type Tool = PlaceMovableTool | PlaceStaticTool | DeleteTool | ResetTool | PlaceLabelTool | PlaceMeasurementTool | SelectTool;

export const toolCategories: { categoryName: string, showAlways: boolean, tools: Tool[] }[] = [
    {
        categoryName: 'General',
        showAlways: true,
        tools: [
            { toolType: 'select', label: 'Select object (V)', },
            { toolType: 'delete', label: 'Eraser (D)', },
            { toolType: 'placeLabel', label: 'Place label (T)', },
            { toolType: 'placeMeasurement', subType: 'measurement', label: 'Measure', title: 'Place measurement (M)', },
            { toolType: 'placeMeasurement', subType: 'arrow', label: 'Arrow', title: 'Place arrow', },
            { toolType: 'placeMeasurement', subType: 'line', label: 'Line', title: 'Place line', },
            // { toolType: 'reset' },
        ]
    },
    {
        categoryName: 'Fast Jets',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'viper', speedKnots: 400, label: 'Place viper' },
            { toolType: 'placeMovable', objectType: 'hornet', speedKnots: 400, label: 'Place hornet' },
            { toolType: 'placeMovable', objectType: 'viggen', speedKnots: 400, label: 'Place viggen' },
            { toolType: 'placeMovable', objectType: 'tomcat', speedKnots: 400, label: 'Place tomcat' },
            { toolType: 'placeMovable', objectType: 'warthog', speedKnots: 200, label: 'Place warthog' },
            { toolType: 'placeMovable', objectType: 'albatros', speedKnots: 200, label: 'Place albatros' },
            { toolType: 'placeMovable', objectType: 'fishbed', speedKnots: 400, label: 'Place fishbed' },
            { toolType: 'placeMovable', objectType: 'flanker', speedKnots: 400, label: 'Place flanker' },
            { toolType: 'placeMovable', objectType: 'gripen', speedKnots: 400, label: 'Place gripen' },
            { toolType: 'placeMovable', objectType: 'thunder', speedKnots: 400, label: 'Place thunder' },
            { toolType: 'placeMovable', objectType: 'tiger', speedKnots: 400, label: 'Place tiger' },
            { toolType: 'placeMovable', objectType: 'harrier', speedKnots: 400, label: 'Place harrier' },
        ]
    },
    {
        categoryName: 'Heavies',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'awacs', speedKnots: 400, label: 'Place awacs' },
            { toolType: 'placeMovable', objectType: 'blackjack', speedKnots: 400, label: 'Place blackjack' },
            { toolType: 'placeMovable', objectType: 'hercules', speedKnots: 200, label: 'Place hercules' },
            { toolType: 'placeMovable', objectType: 'lancer', speedKnots: 400, label: 'Place lancer' },
            { toolType: 'placeMovable', objectType: 'stratofortress', speedKnots: 400, label: 'Place stratofortress' },
            { toolType: 'placeMovable', objectType: 'tanker', speedKnots: 400, label: 'Place tanker' },
        ]
    },
    {
        categoryName: 'Helicopters',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'apache', speedKnots: 150, pathSmoothness: 0.2, label: 'Place apache' },
            { toolType: 'placeMovable', objectType: 'hind', speedKnots: 150, pathSmoothness: 0.2, label: 'Place hind' },
            { toolType: 'placeMovable', objectType: 'huey', speedKnots: 100, pathSmoothness: 0.2, label: 'Place huey' },
        ]
    },
    {
        categoryName: 'Weapons',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'mk82', speedKnots: 300, endType: 'expl_m', pathSmoothness: 0.8, label: 'Place Mk82 bomb' },
            { toolType: 'placeMovable', objectType: 'amraam', speedKnots: 1000, endType: 'expl_m', pathSmoothness: 0.5, label: 'Place AMRAAM missile' },
            { toolType: 'placeMovable', objectType: 'sidewinder', speedKnots: 1000, endType: 'expl_m', pathSmoothness: 0.3, label: 'Place sidewinder missile' },
            { toolType: 'placeMovable', objectType: 'harm', speedKnots: 1000, endType: 'expl_m', pathSmoothness: 0.7, label: 'Place HARM missile' },
        ]
    },
    {
        categoryName: 'Ships',
        showAlways: false,
        tools: [
            { toolType: 'placeMovable', objectType: 'carrier', speedKnots: 30, pathSmoothness: 0.5, label: 'Place carrier' },
            { toolType: 'placeMovable', objectType: 'cruiser', speedKnots: 30, pathSmoothness: 0.5, label: 'Place cruiser' },
        ]
    },
    {
        categoryName: 'Ground',
        showAlways: false,
        tools: [
            // { toolType: 'placeMovable', objectType: 'infantry', speedKnots: 10, label: 'Place infantry' },
            { toolType: 'placeMovable', objectType: 'apc', speedKnots: 50, pathSmoothness: 0.15, label: 'Place APC' },
            { toolType: 'placeMovable', objectType: 'tank', speedKnots: 50, pathSmoothness: 0.15, label: 'Place tank' },
            { toolType: 'placeMovable', objectType: 'truck', speedKnots: 50, pathSmoothness: 0.15, label: 'Place truck' },
            { toolType: 'placeMovable', objectType: 'manpad', speedKnots: 10, pathSmoothness: 0.05, label: 'Place MANPAD' },
            { toolType: 'placeMovable', objectType: 'mobilesam', speedKnots: 50, pathSmoothness: 0.15, label: 'Place mobile SAM' },
        ]
    },
    {
        categoryName: 'Installations',
        showAlways: false,
        tools: [
            { toolType: 'placeStatic', objectType: 'bullseye', label: 'Place bullseye' },
            { toolType: 'placeStatic', objectType: 'airfield', label: 'Place airfield' },
            { toolType: 'placeStatic', objectType: 'bridge', label: 'Place bridge' },
            { toolType: 'placeStatic', objectType: 'aaa', label: 'Place AAA' },
            { toolType: 'placeStatic', objectType: 'samsite', label: 'Place SAM-site' },
        ]
    },
];
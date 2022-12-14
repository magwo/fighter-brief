
export const airplaneList = ['albatros', 'awacs', 'blackjack', 'fishbed', 'flanker', 'gripen', 'harrier', 'hercules', 'hornet', 'lancer', 'stratofortress', 'tanker', 'thunder', 'tiger', 'tomcat', 'viggen', 'viper', 'warthog'] as const;
export const helicopterList = ['apache', 'hind', 'huey'] as const;
export const shipList = ['carrier', 'cruiser', 'frigate', 'gunboat', 'cargoship', 'tanker-ship'] as const;
export const staticList = ['bullseye', 'airfield', 'samsite', 'factory', 'bridge', 'base', 'farp', 'aaa'] as const;
export const weaponList = ['amraam', 'sidewinder', 'mk82', 'harm', 'hellfire', 'rockets', 'cruise-missile'] as const;
export const groundList = ['infantry', 'manpad', 'truck', 'apc', 'tank', 'mobilesam'] as const;
export const endList = ['expl_m'] as const;
export const measurementSubTypeList = ['measurement', 'arrow', 'line'];
export const infoList = ['label', ...measurementSubTypeList] as const;
export const unitList: string[] = [...airplaneList, ...helicopterList, ...shipList, ...groundList, ...staticList, ...weaponList];
export const movableList: string[] = [...airplaneList, ...helicopterList, ...shipList, ...groundList, ...weaponList];

export type AirplaneType = typeof airplaneList[number];
export type HelicopterType = typeof helicopterList[number];
export type ShipType = typeof shipList[number];
export type StaticType = typeof staticList[number];
export type WeaponType = typeof weaponList[number];
export type GroundType = typeof groundList[number];
export type EndType = typeof endList[number] | null;
export type InfoType = typeof infoList[number];

export type BattleFieldObjectType = AirplaneType | HelicopterType | ShipType | GroundType | StaticType | WeaponType | InfoType;


export const formationList = ['', 'echelon-right', 'echelon-left', 'finger-four-left', 'finger-four-right', 'combat-spread', 'trail'] as const;
export type FormationType = typeof formationList[number];

export const mapList: string[] = ['', 'ca', 'sy', 'pg'/*, 'sa'*/];
export type MapType = typeof mapList[number];

export const coalitionList: string[] = ['', 'blue', 'red'];
export type CoalitionType = typeof coalitionList[number];

export type MeasurementSubType = typeof measurementSubTypeList[number];
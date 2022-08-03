
export const airplaneList = ['albatros', 'awacs', 'blackjack', 'fishbed', 'flanker', 'gripen', 'harrier', 'hercules', 'hornet', 'lancer', 'stratofortress', 'tanker', 'thunder', 'tiger', 'tomcat', 'viggen', 'viper', 'warthog'] as const;
export const helicopterList = ['apache', 'hind', 'huey'] as const;
export const shipList = ['carrier'] as const;
export const staticList = ['airfield', 'SAM-site', 'factory', 'bridge', 'base', 'farp'] as const;
export const weaponList = ['amraam', 'sidewinder', 'mk82', 'harm', 'hellfire', 'rockets', 'cruise-missile'] as const;
export const groundList = ['infantry', 'manpad', 'truck', 'apc', 'tank', 'mobile-SAM'] as const;
export const endList = ['expl_m'] as const;
export const infoList = ['label', 'measurement'] as const;
export const unitList: string[] = [...airplaneList, ...helicopterList, ...shipList, ...groundList, ...staticList, ...weaponList];

export type AirplaneType = typeof airplaneList[number];
export type HelicopterType = typeof helicopterList[number];
export type ShipType = typeof shipList[number];
export type StaticType = typeof staticList[number];
export type WeaponType = typeof weaponList[number];
export type GroundType = typeof groundList[number];
export type EndType = typeof endList[number] | null;
export type InfoType = typeof infoList[number];

export type BattleFieldObjectType = AirplaneType | HelicopterType | ShipType | GroundType | StaticType | WeaponType | InfoType;
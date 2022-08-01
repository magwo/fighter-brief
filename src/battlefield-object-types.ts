
export type AircraftType = 'albatros' | 'apache' | 'awacs' | 'blackjack' | 'fishbed' | 'flanker' | 'gripen' | 'harrier' | 'hercules' | 'hind' | 'hornet' | 'huey' | 'lancer' | 'stratofortress' | 'tanker' | 'thunder' | 'tiger' | 'tomcat' | 'viggen' | 'viper' | 'warthog';
export type ShipType = 'carrier';
export type StaticType = 'airfield';
export type WeaponType = 'amraam' | 'sidewinder' | 'mk82';
export type EndType = 'expl_m' | null;
export type InfoType = 'label' | 'measurement';

export type BattleFieldObjectType = AircraftType | ShipType | StaticType | WeaponType | EndType | InfoType;

export const aircraftList: AircraftType[] = ['albatros', 'awacs', 'blackjack', 'fishbed', 'flanker', 'gripen', 'harrier', 'hercules', 'hornet', 'lancer', 'stratofortress', 'tanker', 'thunder', 'tiger', 'tomcat', 'viggen', 'viper', 'warthog'];
export const helicopterList: AircraftType[] = ['apache', 'hind', 'huey'];
export const shipList: ShipType[] = ['carrier'];
export const staticList: StaticType[] = ['airfield'];
export const weaponList: WeaponType[] = ['amraam', 'sidewinder', 'mk82'];

export const unitList: string[] = [...aircraftList, ...helicopterList, ...shipList, ...staticList, ...weaponList];
export const infoList: InfoType[] = ['label', 'measurement'];
// export const groundMoverList: AircraftType[] = ['apache', 'hind', 'huey'];

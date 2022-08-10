import React, { FC } from 'react';
import { BattlefieldObject, createBattlefieldObject, getHeadingAlongCurve, getPositionAlongCurve, Path, Position, PositionMath } from '../../battlefield-object';
import { FormationType } from '../../battlefield-object-types';
import Unit from '../Unit/Unit';
import './Group.css';

const WINGMAN_STD_ANGLE = Math.PI - (1/4) * Math.PI;
const WINGMAN_STD_DISTANCE = 32;

const formationFunctions: Record<FormationType, (wingman: BattlefieldObject, lead: BattlefieldObject, leadsAngle: number, wingmanNum: number, time: number) => void> = {
  '': (wingman: BattlefieldObject, lead: BattlefieldObject, leadsAngle: number, wingmanNum: number, time: number) => {
    // Do nothing
  },
  'echelon-right': (wingman: BattlefieldObject, lead: BattlefieldObject, leadsAngle: number, wingmanNum: number, time: number) => {
    const posAngle = leadsAngle + WINGMAN_STD_ANGLE;
    wingman.position[0] = lead.position[0] + WINGMAN_STD_DISTANCE * wingmanNum * Math.cos(posAngle);
    wingman.position[1] = lead.position[1] + WINGMAN_STD_DISTANCE * wingmanNum * Math.sin(posAngle);
  },
  'echelon-left': (wingman: BattlefieldObject, lead: BattlefieldObject, leadsAngle: number, wingmanNum: number, time: number) => {
    const posAngle = leadsAngle - WINGMAN_STD_ANGLE;
    wingman.position[0] = lead.position[0] + WINGMAN_STD_DISTANCE * wingmanNum * Math.cos(posAngle);
    wingman.position[1] = lead.position[1] + WINGMAN_STD_DISTANCE * wingmanNum * Math.sin(posAngle);
  },
  'finger-four-right': (wingman: BattlefieldObject, lead: BattlefieldObject, leadsAngle: number, wingmanNum: number, time: number) => {
    const posAngle = wingmanNum === 1 ? leadsAngle - WINGMAN_STD_ANGLE : leadsAngle + WINGMAN_STD_ANGLE;
    const distance = wingmanNum <= 2 ? WINGMAN_STD_DISTANCE : (wingmanNum - 1) * WINGMAN_STD_DISTANCE;
    wingman.position[0] = lead.position[0] + distance * Math.cos(posAngle);
    wingman.position[1] = lead.position[1] + distance * Math.sin(posAngle);
  },
  'finger-four-left': (wingman: BattlefieldObject, lead: BattlefieldObject, leadsAngle: number, wingmanNum: number, time: number) => {
    const posAngle = wingmanNum === 1 ? leadsAngle + WINGMAN_STD_ANGLE : leadsAngle - WINGMAN_STD_ANGLE;
    const distance = wingmanNum <= 2 ? WINGMAN_STD_DISTANCE : (wingmanNum - 1) * WINGMAN_STD_DISTANCE;
    wingman.position[0] = lead.position[0] + distance * Math.cos(posAngle);
    wingman.position[1] = lead.position[1] + distance * Math.sin(posAngle);
  },
  'combat-spread': (wingman: BattlefieldObject, lead: BattlefieldObject, leadsAngle: number, wingmanNum: number, time: number) => {
    const posAngle = wingmanNum % 2 === 0 ? leadsAngle - Math.PI / 2 : leadsAngle + Math.PI / 2;
    const distance = WINGMAN_STD_DISTANCE * Math.ceil(wingmanNum / 2);
    wingman.position[0] = lead.position[0] + distance * Math.cos(posAngle);
    wingman.position[1] = lead.position[1] + distance * Math.sin(posAngle);
  },
  'trail': (wingman: BattlefieldObject, lead: BattlefieldObject, leadsAngle: number, wingmanNum: number, time: number) => {
    const timeDelay = wingmanNum * 10 * WINGMAN_STD_DISTANCE / lead.speed;
    const wingmanTime = Math.max(0, time - timeDelay);
    wingman.heading = getHeadingAlongCurve(lead, wingmanTime);
    wingman.position = getPositionAlongCurve(lead, wingmanTime);
  },
}

function getWingmenPositionsAndHeadings(lead: BattlefieldObject, time: number): BattlefieldObject[] {
  const wingmen: BattlefieldObject[] = [];

  for (let i=1; i<=lead.wingmanCount; i++) {
    const wingman = createBattlefieldObject(`${lead.id}-${i}`, '', lead.type, lead.endType, [...lead.position], lead.heading, lead.startTime, lead.speed, 0, '');
    const angle = PositionMath.angleFromHeading(lead.heading);
    formationFunctions[lead.formation](wingman, lead, angle, i, time);
    wingmen.push(wingman);
  }

  return wingmen;
}


interface GroupProps {
  object: BattlefieldObject,
  isInactive: boolean,
  shouldShowPath: boolean,
  time: number,
  onClick?: (e: React.MouseEvent) => void,
}

const Group: FC<GroupProps> = (props) => {
  const wingmen: BattlefieldObject[] = getWingmenPositionsAndHeadings(props.object, props.time);

  return (
    <div className={`Group`} data-testid="Group" onClick={props.onClick}>
      <Unit object={props.object} isInactive={props.isInactive} shouldShowPath={props.shouldShowPath} />
      {wingmen.map((object) =>
          <Unit object={object} isInactive={props.isInactive} key={object.id} shouldShowPath={false} />
      )}
    </div>
  );
}

export default Group;

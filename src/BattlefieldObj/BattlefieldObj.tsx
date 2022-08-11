import React, { FC } from 'react';
import { BattlefieldObject } from '../battlefield-object';
import { unitList } from '../battlefield-object-types';
import './BattlefieldObj.css';
import Group from './Group/Group';
import Label from './Label/Label';
import Measurement from './Measurement/Measurement';


interface BattlefieldObjProps {
  object: BattlefieldObject,
  isSelected: boolean;
  isInactive: boolean,
  shouldShowPath: boolean,
  time: number, // Only needed for trail formation - to delay wingmen positions in path
  onClick?: (e: React.MouseEvent) => void,
}

const BattlefieldObj: FC<BattlefieldObjProps> = (props) => {
  return (
    <div className={`BattlefieldObj${props.object.isVisible ? '' : ' invisible'}`} data-testid="BattlefieldObj" onClick={props.onClick}>
        {unitList.includes(props.object.type as string) &&
          //  TOOD: pass onClick?
          <Group object={props.object} isSelected={props.isSelected} isInactive={props.isInactive} shouldShowPath={props.shouldShowPath} time={props.time} />
        }
        {props.object.type === 'label' &&
          <Label object={props.object} isSelected={props.isSelected} isInactive={props.isInactive} />
        }
        {props.object.type === 'measurement' &&
          <Measurement object={props.object} isSelected={props.isSelected} isInactive={props.isInactive} />
        }
    </div>
  );
}

export default BattlefieldObj;

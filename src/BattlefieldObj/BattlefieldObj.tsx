import React, { FC } from 'react';
import { BattlefieldObject } from '../battlefield-object';
import { infoList, InfoType, unitList } from '../battlefield-object-types';
import './BattlefieldObj.css';
import Label from './Label/Label';
import Measurement from './Measurement/Measurement';
import Unit from './Unit/Unit';


interface BattlefieldObjProps {
  object: BattlefieldObject,
  isInactive: boolean,
  shouldShowPath: boolean,
  onClick?: (e: React.MouseEvent) => void,
}

const BattlefieldObj: FC<BattlefieldObjProps> = (props) => {
  return (
    <div className={`BattlefieldObj${props.object.isVisible ? '' : ' invisible'}`} data-testid="BattlefieldObj" onClick={props.onClick}>
        {unitList.includes(props.object.type as string) &&
          <Unit object={props.object} isInactive={props.isInactive} shouldShowPath={props.shouldShowPath} />
        }
        {props.object.type === 'label' &&
          <Label object={props.object} isInactive={props.isInactive} />
        }
        {props.object.type === 'measurement' &&
          <Measurement object={props.object} isInactive={props.isInactive} />
        }
    </div>
  );
}

export default BattlefieldObj;

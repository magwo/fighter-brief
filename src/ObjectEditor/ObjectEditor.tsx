import React, { FC, useEffect, useState } from 'react';
import { BattlefieldObject, SpeedKnots } from '../battlefield-object';
import { formationList, FormationType, movableList } from '../battlefield-object-types';
import './ObjectEditor.css';

interface ObjectEditorProps {
  object: BattlefieldObject,
  onObjectModified: (object: BattlefieldObject) => void,
}

interface Values {
  name: string,
  speed: number,
  wingmanCount: number,
  formation: FormationType,
}

const ObjectEditor: FC<ObjectEditorProps> = (props: ObjectEditorProps) => {
  const [values, setValues] = useState<Values>({ name: "", speed: 0, wingmanCount: 0, formation: '' })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Do nothing
    alert('Submitted ' + e);
    e.preventDefault();
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({...values, name: e.target.value});
    props.object.name = e.target.value;
    props.onObjectModified(props.object);
  }

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({...values, speed: Number(e.target.value)});
    props.object.speed = Number(e.target.value) as SpeedKnots;
    props.onObjectModified(props.object);
  }

  const handleWingmanCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({...values, wingmanCount: Number(e.target.value)});
    props.object.wingmanCount = Number(e.target.value);
    props.onObjectModified(props.object);
  }

  const handleFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({...values, formation: e.target.value as FormationType});
    props.object.formation = e.target.value as FormationType;
    props.onObjectModified(props.object);
  }

  // TODO: Use effect and save object copy from props? Not sure if needed :S

  useEffect(() => {
    setValues({name: props.object.name, speed: props.object.speed, wingmanCount: props.object.wingmanCount, formation: props.object.formation});
  }, [props.object]);


  return (
    <div className="ObjectEditor" data-testid="ObjectEditor" onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <h2>Editing {props.object.type}</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" value={values.name} onChange={handleNameChange} />
        </label>
        {movableList.includes(props.object.type) &&
        <div>
          <label>
            Speed (knots)
            <input type="number" step="10" value={values.speed} onChange={handleSpeedChange} />
          </label>
          <label>
            Number of wingmen
            <input type="number" step="1" max="8" min="0" value={values.wingmanCount} onChange={handleWingmanCountChange} />
          </label>
          <label>
            Formation
            <div className="select-wrapper">
              <select value={values.formation} onChange={handleFormationChange}>
                {formationList.map((formation) =>
                  <option value={formation} key={'option-' + formation}>{formation}</option>
                )
                }
              </select>
              </div>
          </label>
        </div>
        }
      </form>


    </div >
  );
}

export default ObjectEditor;

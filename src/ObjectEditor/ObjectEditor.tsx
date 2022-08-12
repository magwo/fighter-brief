import React, { FC, useEffect, useState } from 'react';
import { BattlefieldObject, SpeedKnots } from '../battlefield-object';
import { CoalitionType, formationList, FormationType, movableList } from '../battlefield-object-types';
import './ObjectEditor.css';


const EMOJI_BUTTONS = ["🇮🇱", "🇸🇾", "🇺🇸", "🇷🇺", "🇸🇪"];


interface ObjectEditorProps {
  object: BattlefieldObject,
  onObjectModified: (object: BattlefieldObject) => void,
}

interface Values {
  name: string,
  coalition: CoalitionType,
  speed: number,
  wingmanCount: number,
  formation: FormationType,
}

const ObjectEditor: FC<ObjectEditorProps> = (props: ObjectEditorProps) => {
  const [values, setValues] = useState<Values>({ name: "", coalition: '', speed: 0, wingmanCount: 0, formation: '' })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Do nothing
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

  const handleCoalitionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({...values, coalition: e.target.value as CoalitionType});
    props.object.coalition = e.target.value as CoalitionType;
    props.onObjectModified(props.object);
  }

  const addNameString = (str: string) => {
    const newName = values.name + str;
    setValues({...values, name: newName});
    props.object.name = newName;
    props.onObjectModified(props.object);
  }

  useEffect(() => {
    setValues({name: props.object.name, coalition: props.object.coalition, speed: props.object.speed, wingmanCount: props.object.wingmanCount, formation: props.object.formation});
  }, [props.object]);


  return (
    <div className="ObjectEditor" data-testid="ObjectEditor" onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <h2>Editing {props.object.type}</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" value={values.name} onChange={handleNameChange} />
        </label>
        <div className="emoji-buttons">
          {EMOJI_BUTTONS.map((b) => {
            return <div className="clickable" key={`emojibutton-${b}`} onClick={() => addNameString(b)}>{b}</div>
          })}
        </div>
        <label>
          Coalition
          <div className="select-wrapper">
            <select value={values.coalition} onChange={handleCoalitionChange}>
              <option value={''} key={'coalition-neutral'}>Neutral</option>
              <option value={'blue'} key={'coalition-blue'}>Blue</option>
              <option value={'red'} key={'coalition-red'}>Red</option>
            </select>
            </div>
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

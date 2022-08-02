import React, { FC, useEffect, useState } from 'react';
import { BattlefieldObject, Speed } from '../../battlefield-object';
import './ObjectEditor.css';

interface ObjectEditorProps {
  object: BattlefieldObject,
  onObjectModified: (object: BattlefieldObject) => void,
}

interface Values {
  name: string,
  speed: number,
}

const ObjectEditor: FC<ObjectEditorProps> = (props: ObjectEditorProps) => {
  const [values, setValues] = useState<Values>({ name: "", speed: 0 })

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
    props.object.speed = new Speed(Number(e.target.value));
    props.onObjectModified(props.object);
  }

  // TODO: Use effect and save object copy from props? Not sure if needed :S

  useEffect(() => {
    setValues({name: props.object.name, speed: props.object.speed.metersPerSecond});
  }, [props.object]);


  return (
    <div className="ObjectEditor" data-testid="ObjectEditor" onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <h2>Editing {props.object.type}</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" value={values.name} onChange={handleNameChange} />
        </label>
        <label>
          Speed
          <input type="number" value={values.speed} onChange={handleSpeedChange} />
        </label>
      </form>


    </div >
  );
}

export default ObjectEditor;

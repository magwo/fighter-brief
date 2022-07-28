import React, { FC, useState } from 'react';
import './Controlbar.css';

interface ControlbarProps {
  onPlayPause: (shouldPlay: boolean) => void
  onRewind: () => void
}

const Controlbar: FC<ControlbarProps> = (props: ControlbarProps) => {
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);

  return (
    <div className="Controlbar" data-testid="Controlbar">
      <div className="buttons">
        <button className='play-pause' onClick={() => { props.onPlayPause(!shouldPlay); setShouldPlay(!shouldPlay); }}>{shouldPlay ? "⏸" : "▶"}</button>
        <button className='rewind' onClick={() => { props.onRewind(); }}>⏪</button>
      </div>
    </div>
  );
}

export default Controlbar;

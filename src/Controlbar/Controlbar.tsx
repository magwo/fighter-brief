import React, { FC, useState } from 'react';
import useAnimationFrame from '../useAnimationFrame';
import './Controlbar.css';

interface ControlbarProps {
  onTimeChange: (timeDelta: number, time: number) => void,
  onPlayPause: (shouldPlay: boolean) => void
}

const Controlbar: FC<ControlbarProps> = (props: ControlbarProps) => {
  const [time, setTime] = useState<number>(0);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);

  useAnimationFrame((_time: { time: number; delta: number }) => {
    const timeDelta = shouldPlay ? _time.delta : 0;
    const newTime = time + timeDelta;
    setTime(newTime);
    props.onTimeChange(timeDelta, newTime);
  });

  const rewind = () => {
    const oldTime = time;
    setTime(0);
    props.onTimeChange(0 - oldTime, 0);
  }

  const playPause = () => {
    const newPlayState = !shouldPlay;
    props.onPlayPause(newPlayState);
    setShouldPlay(newPlayState);
  }

  return (
    <div className="Controlbar" data-testid="Controlbar">
      <div className="buttons">
        <button className='play-pause' onClick={() => { playPause() }}>{shouldPlay ? "⏸" : "▶"}</button>
        <button className='rewind' onClick={() => rewind() }>⏪</button>
      </div>
    </div>
  );
}

export default Controlbar;

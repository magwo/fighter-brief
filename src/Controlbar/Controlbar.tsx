import React, { FC, useState } from 'react';
import useAnimationFrame from '../useAnimationFrame';
import './Controlbar.css';

const TIME_BAR_WIDTH = 400;

interface ControlbarProps {
  onTimeChange: (timeDelta: number, time: number) => void,
  onPlayPause: (shouldPlay: boolean) => void
}

const Controlbar: FC<ControlbarProps> = (props: ControlbarProps) => {
  const [time, setTime] = useState<number>(0);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [shouldLoop, setShouldLoop] = useState<boolean>(false);

  useAnimationFrame((_time: { time: number; delta: number }) => {
    const timeDelta = shouldPlay ? _time.delta : 0;
    let newTime = time + timeDelta;
    // TODO: Make maximum time adaptive based on units
    if (newTime > 1.0 && shouldLoop) {
      newTime = 0;
    }
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

  const toggleLoop = () => {
    const newLoopState = !shouldLoop;
    setShouldLoop(newLoopState);
  }

  const mouseMoveOnTimebar = (e: React.MouseEvent) => {
    if (e.buttons === 1 && e.target === e.currentTarget) {
      const relX = e.currentTarget.getBoundingClientRect().left;
      // const relY = e.currentTarget.clientTop;
      const fraction = (e.clientX - relX) / TIME_BAR_WIDTH;
      setTime(fraction);
      console.log("Moving on timebar", e.clientX);
    }
  }

  const styleTimeHandle = {
    transform: `translate(${time * TIME_BAR_WIDTH}px, 0)`
  };

  return (
    <div className="Controlbar" data-testid="Controlbar">
      <div className="buttons">
        <button className='play-pause' onClick={() => { playPause() }}>{shouldPlay ? "⏸" : "⏯"}</button>
        <button className='rewind' onClick={() => rewind()}>⏮</button>
        <button className={`loop${shouldLoop ? " do-loop" : ""}`} onClick={() => toggleLoop()}>🔁</button>
      </div>
      <div className="timebar" onMouseMove={(e: React.MouseEvent) => mouseMoveOnTimebar(e) } onMouseDown={(e: React.MouseEvent) => mouseMoveOnTimebar(e) }>
        <div style={styleTimeHandle} className="handle"></div>
      </div>
    </div >
  );
}

export default Controlbar;

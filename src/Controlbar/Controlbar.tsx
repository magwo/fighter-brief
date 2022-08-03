import React, { FC, useEffect, useState } from 'react';
import useAnimationFrame from '../useAnimationFrame';
import { ReactComponent as Play } from './images/play.svg';
import { ReactComponent as Pause } from './images/pause.svg';
import { ReactComponent as BackwardFast } from './images/backward-fast.svg';
import { ReactComponent as Repeat } from './images/repeat.svg';
import './Controlbar.css';

const TIME_BAR_WIDTH = 400;

const PLAYBACK_SPEEDS = [0.4, 1, 3, 9];

const NONE_TAB_INDEX = -1;

interface ControlbarProps {
  stopTime: number;
  onTimeChange: (time: number) => void,
  onPlayPause: (shouldPlay: boolean) => void
}

const Controlbar: FC<ControlbarProps> = (props: ControlbarProps) => {
  const [time, setTime] = useState<number>(0);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [shouldLoop, setShouldLoop] = useState<boolean>(false);
  const [playbackSpeedIndex, setPlaybackSpeedIndex] = useState<number>(1);
  const [forcedPlayback, setForcedPlayback] = useState<number | null>(null);

  useAnimationFrame((_time: { time: number; delta: number }) => {
    let timeDelta = shouldPlay ? _time.delta : 0;
    if (forcedPlayback !== null) {
      timeDelta = _time.delta * forcedPlayback;
    }
    let newTime = time + timeDelta * PLAYBACK_SPEEDS[playbackSpeedIndex];
    newTime = Math.max(0, newTime);
    if (newTime > props.stopTime) {
      if (shouldLoop && forcedPlayback === null) {
        newTime = 0;
      }
      else if(forcedPlayback === null) {
        playPause();
        newTime = props.stopTime
      } else {
        newTime = props.stopTime
      }
    }

    if (newTime !== time) {
      setTime(newTime);
      props.onTimeChange(newTime);
    }
  });

  const rewind = () => {
    setTime(0);
    props.onTimeChange(0);
  }

  const playPause = () => {
    const newPlayState = !shouldPlay;
    if (time === props.stopTime) {
      setTime(0);
    }
    props.onPlayPause(newPlayState);
    setShouldPlay(newPlayState);
  }

  const toggleLoop = () => {
    const newLoopState = !shouldLoop;
    setShouldLoop(newLoopState);
  }

  const togglePlaybackSpeed = () => {
    setPlaybackSpeedIndex((playbackSpeedIndex + 1) % PLAYBACK_SPEEDS.length);
  }

  const mouseMoveOnTimebar = (e: React.MouseEvent) => {
    if (e.buttons === 1 && e.target === e.currentTarget) {
      const relX = e.currentTarget.getBoundingClientRect().left;
      let fraction = (e.clientX - relX) / TIME_BAR_WIDTH;
      fraction = Math.max(0, Math.min(1, fraction));
      const newTime = fraction * props.stopTime;
      setTime((prevTime) => newTime);
      props.onTimeChange(newTime);
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      playPause();
    } else if(e.key === 'ArrowUp') {
      setPlaybackSpeedIndex(Math.min(PLAYBACK_SPEEDS.length - 1, playbackSpeedIndex + 1));
    } else if(e.key === 'ArrowDown') {
      setPlaybackSpeedIndex(Math.max(0, playbackSpeedIndex - 1));
    } else if(e.key === 'ArrowRight') {
      setForcedPlayback(1.0);
    } else if(e.key === 'ArrowLeft') {
      setForcedPlayback(-1.0);
    }
  }
  const handleKeyup = (e: KeyboardEvent) => {
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      setForcedPlayback(null);
    }
  }

  useEffect(() => {
    // Setup global keypress handler
    window.document.addEventListener("keydown", handleKeydown);
    window.document.addEventListener("keyup", handleKeyup);
    return () => {
      window.document.removeEventListener('keydown', handleKeydown);
      window.document.removeEventListener("keyup", handleKeyup);
    }
  }, [handleKeydown, handleKeyup]);


  const styleTimeHandle = {
    transform: `translate(${(time / props.stopTime) * TIME_BAR_WIDTH}px, 0)`
  };

  return (
    <div className="Controlbar" data-testid="Controlbar">
      <div className="buttons">
        <button className={`play-pause${shouldPlay ? " selected" : ""}`} onClick={() => { playPause() }} tabIndex={NONE_TAB_INDEX}>
          {shouldPlay ? <Pause className="svg-icon" /> : <Play className="svg-icon" />}
        </button>
        <button className='rewind' onClick={() => rewind()} tabIndex={NONE_TAB_INDEX}>
          <BackwardFast className="svg-icon" />
      </button>
        <button className={`loop${shouldLoop ? " selected" : ""}`} onClick={() => toggleLoop()} tabIndex={NONE_TAB_INDEX}>
        <Repeat className="svg-icon" />
        </button>
        <button className="playback-speed" onClick={() => togglePlaybackSpeed()} tabIndex={NONE_TAB_INDEX}>
          {(PLAYBACK_SPEEDS[playbackSpeedIndex] + 'x').replace('0.', '.')}
        </button>
      </div>
      <div className="timebar" onMouseMove={(e: React.MouseEvent) => { mouseMoveOnTimebar(e); } } onMouseDown={(e: React.MouseEvent) => mouseMoveOnTimebar(e) } tabIndex={NONE_TAB_INDEX}>
        <div style={styleTimeHandle} className="handle"></div>
      </div>
    </div >
  );
}

export default Controlbar;

import React, { FC, useEffect, useState } from 'react';
import useAnimationFrame from '../useAnimationFrame';
import { ReactComponent as Play } from './images/play.svg';
import { ReactComponent as Pause } from './images/pause.svg';
import { ReactComponent as BackwardFast } from './images/backward-fast.svg';
import { ReactComponent as Repeat } from './images/repeat.svg';
import { ReactComponent as Route } from './images/route.svg';
import { ReactComponent as Question } from './images/question.svg';
import './Controlbar.css';

const TIME_BAR_WIDTH = 400;

const PLAYBACK_SPEEDS = [0.4, 1, 3, 9];

const ROUTE_DISPLAY_MODES = ["when_paused" ,"always", "never"] as const;
export type RouteDisplayMode = typeof ROUTE_DISPLAY_MODES[number];

interface ControlbarProps {
  stopTime: number;
  onTimeChange: (time: number) => void,
  onPlayPause: (shouldPlay: boolean) => void,
  onShowPaths: (shouldShow: boolean) => void,
}

const Controlbar: FC<ControlbarProps> = (props: ControlbarProps) => {
  const [time, setTime] = useState<number>(0);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [shouldLoop, setShouldLoop] = useState<boolean>(false);
  const [playbackSpeedIndex, setPlaybackSpeedIndex] = useState<number>(1);
  const [forcedPlayback, setForcedPlayback] = useState<number | null>(null);
  const [pathDisplayModeIndex, setPathDisplayModeIndex] = useState<number>(0);

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
      // props.onTimeChange(newTime);
    }
  });

  const rewind = () => {
    setTime(0);
    // props.onTimeChange(0);
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

  const togglePathsMode = () => {
    setPathDisplayModeIndex((pathDisplayModeIndex + 1) % ROUTE_DISPLAY_MODES.length);
  }

  const mouseMoveOnTimebar = (e: React.MouseEvent) => {
    if (e.buttons === 1 && e.target === e.currentTarget) {
      const relX = e.currentTarget.getBoundingClientRect().left;
      let fraction = (e.clientX - relX) / TIME_BAR_WIDTH;
      fraction = Math.max(0, Math.min(1, fraction));
      const newTime = fraction * props.stopTime;
      setTime((prevTime) => newTime);
      // props.onTimeChange(newTime);
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

  useEffect(() => {
    // Is this really needed?
    // Was added due to time bug in workspace caused when deleting objects
    props.onTimeChange(time);
  }, [time, props]);

  useEffect(() => {
    // Is this really needed?
    // Was added due to time bug in workspace caused when deleting objects
    let shouldShow = true;
    if (ROUTE_DISPLAY_MODES[pathDisplayModeIndex] === 'always') {
      shouldShow = true;
    } else if (ROUTE_DISPLAY_MODES[pathDisplayModeIndex] === 'never') {
      shouldShow = false;
    } else if (ROUTE_DISPLAY_MODES[pathDisplayModeIndex] === 'when_paused') {
      shouldShow = shouldPlay ? false : true;
    }
    props.onShowPaths(shouldShow);
  }, [playPause, pathDisplayModeIndex, shouldPlay, props]);


  const styleTimeHandle = {
    transform: `translate(${((time / props.stopTime) * TIME_BAR_WIDTH) - 2}px, 0)`
  };

  return (
    // Use clickable divs instead of buttons - focus messes with global hotkeys
    <div className="Controlbar" data-testid="Controlbar">
      <div className="buttons">
        <div className={`clickable play-pause${shouldPlay ? " selected" : ""}`} onClick={() => { playPause() }}>
          {shouldPlay ? <Pause className="svg-icon" /> : <Play className="svg-icon" />}
        </div>
        <div className='clickable rewind' onClick={() => rewind()}>
          <BackwardFast className="svg-icon" />
        </div>
        <div className={`clickable loop${shouldLoop ? " selected" : ""}`} onClick={() => toggleLoop()}>
        <Repeat className="svg-icon" />
        </div>
        <div className="clickable playback-speed" onClick={() => togglePlaybackSpeed()}>
          {(PLAYBACK_SPEEDS[playbackSpeedIndex] + 'x').replace('0.', '.')}
        </div>
      </div>
      <div className="timebar" onMouseMove={(e: React.MouseEvent) => { mouseMoveOnTimebar(e); } } onMouseDown={(e: React.MouseEvent) => mouseMoveOnTimebar(e) }>
        <div style={styleTimeHandle} className="handle"></div>
      </div>

      <div className="buttons">
        <div className={`clickable toggle-paths`} onClick={() => { togglePathsMode() }} title={`Path display mode: ${ROUTE_DISPLAY_MODES[pathDisplayModeIndex]}`}>
          <Route className={`svg-icon ${ROUTE_DISPLAY_MODES[pathDisplayModeIndex]}`} />
        </div>

        <a href="https://github.com/magwo/fighter-brief#readme" target="_blank" className={`clickable`} onClick={() => { togglePathsMode() }} title="Help">
          <Question className="svg-icon" />
        </a>
      </div>
    </div >
  );
}

export default Controlbar;

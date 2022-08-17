import React, { FC, useCallback, useEffect, useState } from 'react';
import useAnimationFrame from '../useAnimationFrame';
import { ReactComponent as Play } from './images/play.svg';
import { ReactComponent as Pause } from './images/pause.svg';
import { ReactComponent as BackwardFast } from './images/backward-fast.svg';
import { ReactComponent as Repeat } from './images/repeat.svg';
import { ReactComponent as Route } from './images/route.svg';
import { ReactComponent as Question } from './images/question.svg';
import './Controlbar.css';

const TIME_BAR_WIDTH = 400;
const TIME_BAR_LEFT = 191;

const PLAYBACK_SPEEDS = [0.4, 1, 3, 9];

const ROUTE_DISPLAY_MODES = ["when_paused" ,"always", "never"] as const;
export type RouteDisplayMode = typeof ROUTE_DISPLAY_MODES[number];

// TODO: Use parent-state props instead of local state
interface ControlbarProps {
  time: number;
  stopTime: number;
  onTimeChange: (time: number) => void,
  onPlayPause: (shouldPlay: boolean) => void,
  onShowPaths: (shouldShow: boolean) => void,
}

const Controlbar: FC<ControlbarProps> = (props: ControlbarProps) => {
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [shouldLoop, setShouldLoop] = useState<boolean>(false);
  const [playbackSpeedIndex, setPlaybackSpeedIndex] = useState<number>(1);
  const [forcedPlayback, setForcedPlayback] = useState<number | null>(null);
  const [pathDisplayModeIndex, setPathDisplayModeIndex] = useState<number>(0);
  const [draggingTimebar, setDraggingTimebar] = useState<boolean>(false);

  // Destructure props for more efficient dependency handling (I think?):
  const propsTime = props.time;
  const propsStopTime = props.stopTime;
  const propsOnTimeChange = props.onTimeChange;
  const propsOnPlayPause = props.onPlayPause;

  useAnimationFrame((_time: { time: number; delta: number }) => {
    let timeDelta = shouldPlay ? _time.delta : 0;
    if (forcedPlayback !== null) {
      timeDelta = _time.delta * forcedPlayback;
    }
    let newTime = props.time + timeDelta * PLAYBACK_SPEEDS[playbackSpeedIndex];
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

    if (newTime !== props.time) {
      props.onTimeChange(newTime);
    }
  });

  const rewind = () => {
    props.onTimeChange(0);
  }

  const playPause = useCallback(() => {
    const newPlayState = !shouldPlay;
    if (propsTime === propsStopTime) {
      propsOnTimeChange(0);
    }
    propsOnPlayPause(newPlayState);
    setShouldPlay(newPlayState);
  }, [propsTime, propsStopTime, propsOnPlayPause, propsOnTimeChange, shouldPlay]);

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

  const handlePointerUp = useCallback((e: PointerEvent) => {
    setDraggingTimebar(false);
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent | React.PointerEvent, force: 'FORCE' | 'RESPECT_PRESS' = 'RESPECT_PRESS') => {
    // TODO: Maybe use actual element to calculate drag position
    if (draggingTimebar || force === 'FORCE') {
      const relX = TIME_BAR_LEFT; // (e.target as Element).getBoundingClientRect().left;
      let fraction = (e.clientX - relX) / TIME_BAR_WIDTH;
      fraction = Math.max(0, Math.min(1, fraction));
      const newTime = fraction * propsStopTime;
      propsOnTimeChange(newTime);
    }
  }, [propsOnTimeChange, propsStopTime, draggingTimebar]);

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') {
      playPause();
    } else if(e.key === 'ArrowUp') {
      setPlaybackSpeedIndex((currentIndex) => Math.min(PLAYBACK_SPEEDS.length - 1, currentIndex + 1));
    } else if(e.key === 'ArrowDown') {
      setPlaybackSpeedIndex((currentIndex) => Math.max(0, currentIndex - 1));
    } else if(e.key === 'ArrowRight') {
      setForcedPlayback(1.0);
    } else if(e.key === 'ArrowLeft') {
      setForcedPlayback(-1.0);
    }
  }, [playPause]);

  const handleKeyup = useCallback((e: KeyboardEvent) => {
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      setForcedPlayback(null);
    }
  }, []);

  useEffect(() => {
    // Setup global handlers
    window.document.addEventListener("keydown", handleKeydown);
    window.document.addEventListener("keyup", handleKeyup);
    window.document.addEventListener("pointermove", handlePointerMove);
    window.document.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.document.removeEventListener('keydown', handleKeydown);
      window.document.removeEventListener("keyup", handleKeyup);
      window.document.removeEventListener("pointermove", handlePointerMove);
      window.document.removeEventListener("pointerup", handlePointerUp);
    }
  }, [handleKeydown, handleKeyup, handlePointerMove, handlePointerUp]);

  // useEffect(() => {
  //   // Is this really needed?
  //   // Was added due to time bug in workspace caused when deleting objects
  //   props.onTimeChange(time);
  // }, [time, props]);

  useEffect(() => {
    // Is this really needed?
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
    transform: `translate(${((props.time / props.stopTime) * TIME_BAR_WIDTH) - 2}px, 0)`
  };

  return (
    // Uses clickable divs instead of buttons - focus messes with global hotkeys
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
      <div className="timebar" onPointerDown={(e: React.PointerEvent) => { handlePointerMove(e, 'FORCE'); setDraggingTimebar(true) } }>
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

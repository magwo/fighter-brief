import React, { FC } from 'react';
import { useDrag } from '@use-gesture/react'
import useResizeObserver from 'use-resize-observer';
import './Timebar.css';

interface TimebarProps {
  time: number;
  stopTime: number;
  onTimeChange: (time: number) => void;
  onDraggingTimeBar: (dragging: boolean) => void;
}

const Timebar: FC<TimebarProps> = (props: TimebarProps) => {
  const { ref, width = 1 } = useResizeObserver<HTMLDivElement>();

  const handleDrag = (x: number, bar: HTMLElement) => {
    const rect = bar.getBoundingClientRect();
    const relX = rect.left;
    const width = rect.width;
    let fraction = (x - relX) / width;
    fraction = Math.max(0, Math.min(1, fraction));
    const newTime = fraction * props.stopTime;
    props.onTimeChange(newTime);
  };

  const bind = useDrag((e: { pressed: boolean, xy: [number, number], target: any }) => {
    props.onDraggingTimeBar(e.pressed);
    handleDrag(e.xy[0], e.target);
  });

  const styleTimeHandle = {
    transform: `translate(${((props.time / props.stopTime) * width) - 2}px, 0)`
  };

  return (
    <div {...bind()} ref={ref} className="Timebar" data-testid="Timebar">
        <div style={styleTimeHandle} className="handle"></div>
    </div>
  );
}

export default Timebar;

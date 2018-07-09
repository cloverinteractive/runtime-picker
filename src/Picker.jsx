// @flow

import React from 'react';
import { Popover } from 'react-bootstrap';
import ScopedField from './ScopedField';
import inputStyle from './dont-blink';
import type { changeHandler, keyboardHandler, runtimeProps } from './types';

type Props = runtimeProps & {
  handleChange: changeHandler,
  handleKeyboard: keyboardHandler,
  maxHours: number,
  skipSeconds: boolean,
  title: string,
};

const boundedWidth = {
  ...inputStyle,
  maxWidth: '4em',
};

const Picker = ({
  handleChange,
  handleKeyboard,
  hours,
  maxHours,
  minutes,
  seconds,
  skipSeconds: exclude,
  title,
}: Props) => (

  <Popover id="runtime-picker-top" title={title}>
    <input
      data-unscoped
      dir="rtl"
      min={0}
      max={maxHours}
      name="hours"
      onChange={handleChange}
      onKeyDown={handleKeyboard}
      step={1}
      style={boundedWidth}
      type="number"
      value={hours}
    />
    <ScopedField
      handleChange={handleChange}
      handleKeyboard={handleKeyboard}
      name="minutes"
      value={minutes}
    />
    <ScopedField
      exclude={exclude}
      handleChange={handleChange}
      handleKeyboard={handleKeyboard}
      name="seconds"
      value={seconds}
    />
  </Popover>
);

export default Picker;

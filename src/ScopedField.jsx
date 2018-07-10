// @flow
/* eslint-disable jsx-a11y/no-autofocus */

import React from 'react';
import inputStyle from './dont-blink';
import type { changeHandler, keyboardHandler } from './types';

type Props = {
  exclude: boolean,
  handleChange: changeHandler,
  handleKeyboard: keyboardHandler,
  name: string,
  value: string,
};

const defaultProps = {
  exclude: false,
};

const scopedStyle = {
  ...inputStyle,
  maxWidth: '3em',
};

const ScopedField = ({
  exclude,
  handleChange,
  handleKeyboard,
  name,
  value,
}: Props) => {
  if (exclude) return null;

  return (
    <React.Fragment>
      {' : '}
      <input
        autoFocus={!exclude}
        dir="rtl"
        min={0}
        name={name}
        onChange={handleChange}
        onKeyDown={handleKeyboard}
        step={1}
        style={scopedStyle}
        type="number"
        value={value}
      />
    </React.Fragment>
  );
};

ScopedField.defaultProps = defaultProps;

export default ScopedField;

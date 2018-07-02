// @flow

import React from 'react';
import inputStyle from './dont-blink';

type Props = {
  exclude: boolean,
  handleChange: Function,
  handleKeyboard: Function,
  name: string,
  value: string,
};

const defaultProps = {
  exclude: false,
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
        dir="rtl"
        max={59}
        min={0}
        name={name}
        onChange={handleChange}
        onKeyDown={handleKeyboard}
        step={1}
        style={inputStyle}
        type="number"
        value={value}
      />
    </React.Fragment>
  );
};

ScopedField.defaultProps = defaultProps;

export default ScopedField;

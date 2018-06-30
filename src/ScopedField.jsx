import React from 'react';

const ScopedField = ({
  exclude,
  handleChange,
  handleKeyboard,
  name,
  value,
}) => {
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
        type="number"
        value={value}
      />
    </React.Fragment>
  );
};

export default ScopedField;

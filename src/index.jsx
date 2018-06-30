import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import ScopedField from './ScopedField';

const LEDGE = 0; // min value accepted as unit
const REDGE = 59; // max value accepted as unit

const FROM_HOURS = 3600; // hours to second multiplier
const FROM_MINUTES = 60; // minute to second multiplier

const BACKSPACE_CODE = 8;
const MIN_CODE = 48; // min code for numbers
const MAX_CODE = 57; // max code for numbers

const backspaceExpresion = /.$/; // Removes the last character
const clearPadExpression = /^(0+)/; // Removes the zero padding

export default class RuntimePicker extends React.PureComponent {
  static defaultProps = {
    name: 'runtime',
    skipSeconds: false,
    title: 'Pick your Runtime',
    value: 0,
  };

  state = {
    hours: '000',
    minutes: '00',
    seconds: '00',
  };

  componentDidMount() {
    this.fromSeconds();
  }

  toSeconds = () => {
    const { hours, minutes, seconds } = this.state;

    const hoursInSeconds = parseInt(hours, 10) * FROM_HOURS;
    const minutesInSeconds = parseInt(minutes, 10) * FROM_MINUTES;

    return hoursInSeconds + minutesInSeconds + parseInt(seconds, 10);
  };

  fromSeconds = () => {
    const { value } = this.props;

    const hours = Math.floor(value / FROM_HOURS);
    const minutes = Math.floor(value / FROM_MINUTES) % FROM_MINUTES;
    const seconds = (value % FROM_HOURS) % FROM_MINUTES;

    this.setState({
      hours: `${hours}`.padStart(3, '0'),
      minutes: `${minutes}`.padStart(2, '0'),
      seconds: `${seconds}`.padStart(2, 0),
    });
  };

  runtimeDisplay = () => {
    const { hours, minutes, seconds } = this.state;
    const { skipSeconds } = this.props;

    const tail = skipSeconds ? '' : `:${seconds}`;

    return `${hours}:${minutes}${tail}`;
  };

  chainOrTrim = (current, key, isBackspace) => {
    if (isBackspace) return current.replace(backspaceExpresion, '');
    return `${current}${key}`;
  };

  // Handles component update based on control clicks
  handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    const isScoped = currentTarget.getAttribute('data-unscoped');
    const padLength = isScoped ? 3 : 2;

    this.setState(() => {
      const asInt = parseInt(value, 10);

      if (Number.isNaN(asInt)) return null;
      if (asInt < LEDGE || (!isScoped && asInt > REDGE)) return null;

      return {
        [name]: value.padStart(padLength, '0'),
      };
    });
  };

  // handles and sanitizes key presses
  handleKeyboard = (event) => {
    event.persist();
    const { key, keyCode, currentTarget } = event;
    const isNumber = keyCode >= MIN_CODE && keyCode <= MAX_CODE;
    const isBackspace = keyCode === BACKSPACE_CODE;

    if (!isNumber && !isBackspace) return false;

    const { name, value } = currentTarget;
    const isScoped = currentTarget.getAttribute('data-unscoped');
    const padLength = isScoped ? 3 : 2;

    const relevantPart = this.chainOrTrim(value, key, isBackspace)
      .replace(clearPadExpression, '');

    const asInt = parseInt(relevantPart, 10);

    if (Number.isNaN(asInt)) return false;
    if (asInt < LEDGE || (!isScoped && asInt > REDGE)) return false;

    event.preventDefault();

    return this.setState({
      [name]: relevantPart.padStart(padLength, '0'),
    });
  };

  renderPicker = () => {
    const { hours, minutes, seconds } = this.state;
    const { skipSeconds: exclude, title } = this.props;

    return (
      <Popover id="runtime-picker-top" title={title}>
        <input
          data-unscoped
          dir="rtl"
          max={999}
          min={0}
          name="hours"
          onChange={this.handleChange}
          onKeyDown={this.handleKeyboard}
          step={1}
          type="number"
          value={hours}
        />
        <ScopedField
          handleChange={this.handleChange}
          handleKeyboard={this.handleKeyboard}
          name="minutes"
          value={minutes}
        />
        <ScopedField
          exclude={exclude}
          handleChange={this.handleChange}
          handleKeyboard={this.handleKeyboard}
          name="seconds"
          value={seconds}
        />
      </Popover>
    );
  };

  render() {
    const { name } = this.props;

    return (
      <OverlayTrigger
        trigger="click"
        overlay={this.renderPicker()}
        placement="top"
        rootClose
      >
        <label htmlFor={name}>
          {this.runtimeDisplay()}
          <input id={name} name={name} type="hidden" value={this.toSeconds()} />
        </label>
      </OverlayTrigger>
    );
  }
}

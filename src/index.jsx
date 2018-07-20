// @flow

import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import Picker from './Picker';

const RADIX = 10;

const LEDGE = 0; // min value accepted as unit
const REDGE = 59; // max value accepted as unit
const MIN_LENGTH = 8; // minimum number length to be zero-filled

const FROM_HOURS = 3600; // hours to second multiplier
const FROM_MINUTES = 60; // minute to second multiplier

const BACKSPACE_CODE = 8;
const DELETE_CODE = 46;

const breakExpression = /^(\d+)(\d{2})(\d{2})$/; // Breaks runtime units
const backspaceExpresion = /.$/; // Removes the last character
const checkPadExpression = /^(0+)/; // Removes the zero padding
const delimeterEpression = /:/g; // Match runtime delimeter

type Props = {
  disabled: boolean,
  maxHours: number,
  name: string,
  onChange: Function,
  placeholder: string,
  placement: 'bottom' | 'left' | 'right' | 'top',
  skipSeconds: boolean,
  title: string,
  value: number,
};

type State = {
  hours: string,
  minutes: string,
  seconds: string,
};

const NOOP = f => f;

export default class RuntimePicker extends React.PureComponent<Props, State> {
  static defaultProps = {
    disabled: false,
    maxHours: 9999,
    name: 'runtime',
    placeholder: 'HHHH:MM:SS',
    placement: 'top',
    skipSeconds: false,
    title: 'Pick your Runtime',
    value: 0,
  };

  state = {
    hours: '0000',
    minutes: '00',
    seconds: '00',
  };

  componentDidMount() {
    this.fromSeconds();
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      const { hours: h, minutes: m, seconds: s } = this.state;
      const { hours: oH, minutes: oM, seconds: oS } = prevState;

      if (h !== oH || m !== oM || s !== oS) onChange(this.toSeconds());
    }
  }

  toSeconds = (): number => {
    const { hours, minutes, seconds } = this.state;

    const hoursInSeconds = parseInt(hours, RADIX) * FROM_HOURS;
    const minutesInSeconds = parseInt(minutes, RADIX) * FROM_MINUTES;

    return hoursInSeconds + minutesInSeconds + parseInt(seconds, RADIX);
  };

  // Persist or return the current runtime format from seconds in state or props
  fromSeconds = (fromState: boolean = false, persist: boolean = true): State => {
    const { value } = this.props;
    const amount = fromState ? this.toSeconds() : value;

    const hours = Math.floor(amount / FROM_HOURS);
    const minutes = Math.floor(amount / FROM_MINUTES) % FROM_MINUTES;
    const seconds = (amount % FROM_HOURS) % FROM_MINUTES;

    const runtime = {
      hours: `${hours}`.padStart(4, '0'),
      minutes: `${minutes}`.padStart(2, '0'),
      seconds: `${seconds}`.padStart(2, '0'),
    };

    if (persist) this.setState(runtime);
    return runtime;
  };

  runtimeDisplay = (parsed: boolean = true): string => {
    const { hours, minutes, seconds } = parsed ? this.fromSeconds(true, false) : this.state;
    const { skipSeconds } = this.props;

    const tail = skipSeconds ? '' : `:${seconds}`;

    return `${hours}:${minutes}${tail}`;
  };

  chainOrTrim = (current: string, key: string, isBackspace: boolean): string => {
    const { skipSeconds } = this.props;
    const attached = skipSeconds ? `${key}00` : key;

    if (isBackspace) return current.replace(backspaceExpresion, '');
    return `${current}${attached}`;
  };

  isUnscoped = (currentTarget: HTMLInputElement): boolean => Boolean(currentTarget.getAttribute('data-unscoped'));

  isInvalid = (asInt: number, isUnscoped: boolean): boolean => Number.isNaN(asInt)
    || (asInt < LEDGE || (!isUnscoped && asInt > REDGE));

  // Pads and breaks runtime based on unit lengths HHHMMSS
  brokenAndPadded = (value: string): Array<string> => value.padStart(MIN_LENGTH, '0').match(breakExpression)
      || [value, '0000', '00', '00'];

  clearState = () => {
    const [, hours, minutes, seconds] = this.brokenAndPadded('0');

    this.setState({
      hours,
      minutes,
      seconds,
    });
  };

  // Handles component update based on control clicks
  handleChange = ({ currentTarget }: SyntheticEvent<HTMLInputElement>) => {
    const { name, value } = currentTarget;
    const isUnscoped = this.isUnscoped(currentTarget);
    const padLength = isUnscoped ? 4 : 2;
    const asInt = parseInt(value, RADIX);

    this.setState(() => {
      if (this.isInvalid(asInt, isUnscoped)) return null;

      return {
        [name]: value.padStart(padLength, '0'),
      };
    });
  };

  // handles and sanitizes key presses
  handleKeyboard = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    event.persist();

    const { key, keyCode } = event;
    const { maxHours } = this.props;
    const isBackspace = keyCode === BACKSPACE_CODE;
    const isDelete = keyCode === DELETE_CODE;
    const isNumber = parseInt(key, RADIX);

    if (isDelete) this.clearState();
    if (!isNumber && !isBackspace) return false;

    event.preventDefault();

    const value = this.runtimeDisplay(false)
      .replace(delimeterEpression, '');

    const relevantPart = this.chainOrTrim(value, key, isBackspace)
      .replace(checkPadExpression, '');

    const [, hours, minutes, seconds] = this.brokenAndPadded(relevantPart);

    if (parseInt(hours, RADIX) > maxHours) return false;

    return this.setState({
      hours,
      minutes,
      seconds,
    });
  };

  runtimeFace = () => (this.toSeconds() && this.runtimeDisplay())
    || '';

  renderDisabled = () => {
    const { name, placeholder } = this.props;

    return (
      <div className="disabled-runtimePicker">
        <input id={name} name={name} type="hidden" value={this.toSeconds()} />
        <input
          disabled
          className="form-control"
          placeholder={placeholder}
          type="text"
          value={this.runtimeFace()}
        />
      </div>
    );
  };

  render() {
    const {
      disabled,
      maxHours,
      name,
      placeholder,
      placement,
      skipSeconds,
      title,
    } = this.props;

    const { hours, minutes, seconds } = this.state;

    if (disabled) return this.renderDisabled();

    return (
      <div className="runtimePicker">
        <input id={name} name={name} type="hidden" value={this.toSeconds()} />
        <OverlayTrigger
          trigger="click"
          overlay={(
            <Picker
              handleChange={this.handleChange}
              handleKeyboard={this.handleKeyboard}
              hours={hours}
              maxHours={maxHours}
              minutes={minutes}
              seconds={seconds}
              skipSeconds={skipSeconds}
              title={title}
            />
)}
          placement={placement}
          rootClose
        >
          <input
            className="form-control"
            type="text"
            onChange={NOOP}
            placeholder={placeholder}
            value={this.runtimeFace()}
          />
        </OverlayTrigger>
      </div>
    );
  }
}

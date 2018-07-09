// @flow

export type changeHandler = (SyntheticEvent<HTMLInputElement>) => void;

export type keyboardHandler = (SyntheticKeyboardEvent<HTMLInputElement>) => boolean | void;

export type runtimeProps = {
  hours: string,
  minutes: string,
  seconds: string,
};

[ ![Codeship Status for cloverinteractive/runtime-picker](https://app.codeship.com/projects/96305c50-5e62-0136-f3f4-6e975dd0f2b8/status?branch=master)](https://app.codeship.com/projects/296056)
[![Coverage Status](https://coveralls.io/repos/github/cloverinteractive/runtime-picker/badge.svg?branch=features%2Fmax-hours)](https://coveralls.io/github/cloverinteractive/runtime-picker?branch=features%2Fmax-hours)

Runtime-Picker
==============

A react-bootstrap Popover that let's you set a runtime like i fyou were entering time in a microwave.

---

## Dependencies

These are the things your project needs for runtime-picker to work.

* react
* react-dom
* react-bootstrap

## Installation

```
yarn add runtime-picker
```

You can then import it into your webpack components as follows:

```es6
import RuntimePicker from 'runtime-picker';
```

## Usage

Runtime-Picker generates a hidden text field containing the runtime picked calculated in seconds,
so you can submit this as part as our form, however you can send your custom `onChange` handler and
receive the number of seconds when the component updates.

### Runtime-Picker Props

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `disabled` | boolean | `false` | Whether the runtime picker should be disabled, this renders a hidden input as well and visible text field with the parsed runtime |
| `maxHours` | number | `9999` | This is the max number of hours you can enter in your runtime |
| `name` | string | `'runtime'` | The name of the hidden text field containing the runtime in seconds |
| `onChange` | Function | `undefined` | Event handler to be called after the component updates |
| `placeholder` | string | `'HHHH:MMM:SS'` | Visible text field placeholder text |
| `placement` | string | `'bottom' \| 'left' \| 'right' \| 'top'` | This is the Popover position relative to the visible text field |
| `skipSeconds` | boolean | `false` | Whether we wish to start from minutes instead of seconds and lose some granularity |
| `title` | string | `'Pick your Runtime'` | This is the Popover's title |
| `value` | number | `0` | This is the startoff value in seconds |

## Caveats

If you're rendering inside a `<Modal />` make sure to set your modal's `enforceFocus` prop to `false`.

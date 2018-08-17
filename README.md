# react-prev-props

>

[![NPM](https://img.shields.io/npm/v/react-prev-props.svg)](https://www.npmjs.com/package/react-prev-props) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/tlareg/bind-em-all/blob/master/LICENSE)

## Install

```bash
npm install --save react-prev-props
```

## About

Little helper to read previous props in getDerivedStateFromProps. Previous props are saved in component local state.
Before using this lib, make sure your really want to. Maybe there is better way. Please read:

- [react blog - you probably dont need derived state](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)
- [react blog - updating state based on props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)
- [react docs - getDerivedStateFromProps](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
- [react blog - 16.4 bugfix for getDerivedStateFromProps](https://reactjs.org/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops)

## How to use it?

Code example is best description.

Before:

```jsx
UNSAFE_componentWillReceiveProps(nextProps) {
  const nextState = {};

  if (nextProps.value !== this.props.value) {
    nextState.value = nextProps.value;
  }

  if (nextProps.value2 !== this.props.value2) {
    nextState.value2 = nextProps.value2;
  }

  if (nextProps.value3 !== this.props.value3) {
    nextState.value3 = nextProps.value3;
  }

  this.setState(nextState);
}
```

After:

```jsx
import { prevProps } from 'react-prev-props';

// ...

static getDerivedStateFromProps(nextProps, prevState) {
  const { nextState, changedProps } = prevProps(
    ['value', 'value2', 'value3'],
    { nextProps, prevState }
  );

  if (changedProps) {
    // props changed, we can insert some additional logic
    return {
      ...nextState,
      // we can reset state props with changed props
      ...changedProps,
    }
  }

  return nextState;
}
```

Or:

```jsx
import { resetStateWithChangedProps } from 'react-prev-props';

// ...

static getDerivedStateFromProps(nextProps, prevState) {
  return resetStateWithChangedProps(
    ['value', 'value2', 'value3'],
    { nextProps, prevState }
  );
}
```

Or:

```jsx
import { getDerivedStateFromPropsEnhanced } from 'react-prev-props';

// ...

static getDerivedStateFromProps(nextProps, prevState) {
  return getDerivedStateFromPropsEnhanced(
      ['value', 'value2', 'value3'],
      (nextProps, prevState, prevProps, changedProps = {}) => {
        const nextState = {};

        if (changedProps.hasOwnProperty('value')) {
          nextState.value = nextProps.value;
        }

        if (changedProps.hasOwnProperty('value2')) {
          nextState.value2 = nextProps.value2;
        }

        if (changedProps.hasOwnProperty('value3')) {
          nextState.value3 = nextProps.value3;
        }

        return Object.keys(nextState).length ? nextState : null;
    }
  )(nextProps, prevState);
}
```

## How it works?

Prev props are cached in local state.
Code example is best explanation.

```jsx
import { prevProps } from 'react-prev-props';

// ...

static getDerivedStateFromProps(nextProps, prevState) {
  const { nextState, changedProps } = prevProps(
    ['value', 'value2', 'value3'],
    { nextProps, prevState }
  );

  console.log(prevState)
  // => {
  //   _prevProps: { value: 1, value2: 2, value3: 3 },
  //   value2: 2
  // }

  console.log(nextProps)
  // => { value: 1, value2: 999, value3: 3 };

  console.log(nextState)
  // => {
  //   _prevProps: { value: 1, value2: 999, value3: 3 },
  //   value2: 2
  // }

  console.log(changedProps)
  // => { value2: 999 }

  if (changedProps) {
    // props changed, we can insert some additional logic
    return {
      ...nextState,
      // we can reset state props with changed props
      ...changedProps,
    }
  }

  return nextState;
}
```

Or:

```jsx
import { resetStateWithChangedProps } from 'react-prev-props';

// ...

static getDerivedStateFromProps(nextProps, prevState) {
  const nextState = resetStateWithChangedProps(
    ['value', 'value2', 'value3'],
    { nextProps, prevState }
  );

  console.log(prevState)
  // => {
  //   _prevProps: { value: 1, value2: 2, value3: 3 },
  //   value2: 2
  // }

  console.log(nextProps)
  // => { value: 1, value2: 999, value3: 3 };

  console.log(nextState)
  // => {
  //   _prevProps: { value: 1, value2: 999, value3: 3 },
  //   value2: 999
  // }

  return nextState;
}
```

## API

@TODO

## FAQ

- why nextState can't just look like:
  ```js
  nextState = {
    value: nextProps.value
  }
  ```
  instead of:
  ```js
  nextState = {
    _prevProps: {
      value: nextProps.value
    },
    value: nextProps.value
  }
  ```
  ?
  - because: [Anti-pattern: Erasing state when props change](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#anti-pattern-erasing-state-when-props-change)

## License

MIT © [tlareg](https://github.com/tlareg)

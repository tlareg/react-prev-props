import {
  prevProps,
  resetStateWithChangedProps,
  getDerivedStateFromPropsEnhanced
} from './'

const setup = () => {
  const propNames = ['value', 'value2', 'value3']
  const prevState = {
    _prevProps: { value: 1, value2: 2, value3: 3 },
    value2: 2
  }

  return {
    propNames,
    prevState,
  }
}

describe('prevProps', () => {
  it('returns nextState with prevProps', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 1, value2: 999, value3: 3 }

    const { nextState } = prevProps(propNames, { prevState, nextProps })

    const expectedNextState = {
      _prevProps: { value: 1, value2: 999, value3: 3 },
      value2: 2
    }

    expect(nextState).not.toEqual(prevState)
    expect(nextState).toEqual(expectedNextState)
  })

  it('returns null as nextState when no props changed', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 1, value2: 2, value3: 3 }

    const { nextState } = prevProps(propNames, { prevState, nextProps })

    expect(nextState).toBeNull()
  })

  it('returns null as changedProps when no props changed', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 1, value2: 2, value3: 3 }

    const { changedProps } = prevProps(propNames, { prevState, nextProps })

    expect(changedProps).toBeNull()
  })

  it('returns correct changedProps #1', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 1, value2: 999, value3: 3 }

    const { changedProps } = prevProps(propNames, { prevState, nextProps })

    const expectedChangedProps = { value2: 999 }
    expect(changedProps).toEqual(expectedChangedProps)
  })

  it('returns correct changedProps #2', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 1, value2: 999, value3: 888 }

    const { changedProps } = prevProps(propNames, { prevState, nextProps })

    const expectedChangedProps = { value2: 999, value3: 888 }
    expect(changedProps).toEqual(expectedChangedProps)
  })

  it('returns correct changedProps #3', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 111, value2: 999, value3: 888 }

    const { changedProps } = prevProps(propNames, { prevState, nextProps })

    const expectedChangedProps = { value: 111, value2: 999, value3: 888 }
    expect(changedProps).toEqual(expectedChangedProps)
  })

})

describe('resetStateWithChangedProps', () => {
  it('returns null as nextState when no props changed', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 1, value2: 2, value3: 3 }

    const nextState = resetStateWithChangedProps(propNames, { prevState, nextProps })

    expect(nextState).toBeNull()
  })

  it('returns nextState with prevProps and values reseted to changed props values #1', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 1, value2: 999, value3: 3 }

    const nextState = resetStateWithChangedProps(propNames, { prevState, nextProps })

    const expectedNextState = {
      _prevProps: { value: 1, value2: 999, value3: 3 },
      value2: 999
    }

    expect(nextState).not.toEqual(prevState)
    expect(nextState).toEqual(expectedNextState)
  })

  it('returns nextState with prevProps and values reseted to changed props values #2', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 1, value2: 999, value3: 888 }

    const nextState = resetStateWithChangedProps(propNames, { prevState, nextProps })

    const expectedNextState = {
      _prevProps: { value: 1, value2: 999, value3: 888 },
      value2: 999,
      value3: 888,
    }

    expect(nextState).not.toEqual(prevState)
    expect(nextState).toEqual(expectedNextState)
  })

  it('returns nextState with prevProps and values reseted to changed props values #3', () => {
    const { propNames, prevState } = setup()
    const nextProps = { value: 111, value2: 999, value3: 888 }

    const nextState = resetStateWithChangedProps(propNames, { prevState, nextProps })

    const expectedNextState = {
      _prevProps: { value: 111, value2: 999, value3: 888 },
      value: 111,
      value2: 999,
      value3: 888,
    }

    expect(nextState).not.toEqual(prevState)
    expect(nextState).toEqual(expectedNextState)
  })
})

describe('getDerivedStateFromPropsEnhanced', () => {
  it('works', () => {
    const { prevState: inputPrevState } = setup()
    const inputNextProps = { value: 1, value2: 999, value3: 333 }

    class TestComponent {
      static getDerivedStateFromProps(nextProps, prevState) {
        return getDerivedStateFromPropsEnhanced(
            ['value', 'value2', 'value3'],
            (nextProps, prevState, prevProps, changedProps = {}) => {
              const nextState = {};

              expect(nextProps).toEqual(inputNextProps)
              expect(prevState).toEqual(inputPrevState)
              expect(prevProps).toEqual({ value: 1, value2: 2, value3: 3 })
              expect(changedProps).toEqual({ value2: 999, value3: 333 })

              if (changedProps.hasOwnProperty('value')) {
                nextState.value = nextProps.value;
              }

              if (changedProps.hasOwnProperty('value2')) {
                nextState.value2 = nextProps.value2;
              }

              return Object.keys(nextState).length ? nextState : null;
          }
        )(nextProps, prevState)
      }
    }

    const nextState = TestComponent.getDerivedStateFromProps(inputNextProps, inputPrevState)

    const expectedNextState = {
      _prevProps: { value: 1, value2: 999, value3: 333 },
      value2: 999,
    }

    expect(nextState).toEqual(expectedNextState)
  })
})


const prevProps = ({
  nextProps,
  prevState,
  checkChangesInProps,
}) => checkChangesInProps.reduce((acc, propName) => {
  const nextPropValue = nextProps[propName]
  const prevPropStateKey = `prevProps_${propName}`
  const prevPropValue = prevState[prevPropStateKey]

  if (nextPropValue === prevPropValue)  return acc

  const { nextState, changedProps } = acc
  return {
    nextState: {
      ...nextState,
      [prevPropStateKey]: nextPropValue,
    },
    changedProps: {
      ...changedProps,
      [propName]: nextPropValue
    },
  }
}, {
  nextState: null,
  changedProps: {},
})

export default prevProps

export const resetStateWithChangedProps = (opts) => {
  const { nextState, changedProps } = prevProps(opts);
  return nextState ? { ...nextState, ...changedProps } : nextState;
}


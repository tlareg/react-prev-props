const PREV_PROPS_STATE_KEY = '_prevProps';

const getPrevProps = (prevState = {}) => prevState[PREV_PROPS_STATE_KEY]

const getPrevProp = (prevState, propName) => getPrevProps(prevState)[propName]

const setPrevProps = (prevState = {}, prevProps) => ({
  ...prevState,
  [PREV_PROPS_STATE_KEY]: prevProps
})

const updatePrevProps = (prevState = {}, changedProps) =>
  setPrevProps(prevState, { ...getPrevProps(prevState), ...changedProps })


const createIsPropChangedFn = (nextProps, prevState) => propName =>
  nextProps[propName] !== getPrevProp(prevState, propName)

const findChangedProps = (nextProps, prevState, propNames) => {
  const isPropChanged = createIsPropChangedFn(nextProps, prevState);

  return propNames.reduce((changedProps, propName) => {
    if (isPropChanged(propName))  {
      if (!changedProps) changedProps = {}
      changedProps[propName] = nextProps[propName];
    }

    return changedProps
  }, null)
}


export default (propNames, { nextProps, prevState }) => {
  const changedProps = findChangedProps(nextProps, prevState, propNames);
  const nextState = changedProps
    ? updatePrevProps(prevState, changedProps)
    : null
  return { nextState, changedProps }
}

export const resetStateWithChangedProps = (propNames, opts) => {
  const { nextState, changedProps } = prevProps(propNames, opts);
  return nextState ? { ...nextState, ...changedProps } : nextState;
}


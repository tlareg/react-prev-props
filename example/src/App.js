import React, { Component } from 'react'

import prevProps, { resetStateWithChangedProps } from 'react-prev-props'

export default class App extends Component {
  state = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(prevProps);
    console.log(resetStateWithChangedProps);
    return null
  }

  render () {
    return (
      <div>
        AAA
      </div>
    )
  }
}

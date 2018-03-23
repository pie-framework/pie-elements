import React from 'react';
import Main from './main';

export default class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Main />
    );
  }
}
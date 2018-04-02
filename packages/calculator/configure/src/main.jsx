import React from 'react';
import ReactDOM from 'react-dom';
import calculator from '@pie-ui/calculator';

export default class Main extends React.Component {

  constructor() {
    super();
  }

  render() {
    return <calculator mode='basic' />;
  }
}
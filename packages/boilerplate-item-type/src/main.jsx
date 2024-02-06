import React from 'react';
import PropTypes from 'prop-types';
import { PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import TEST from '@pie-element/common';

console.log('TEST', TEST);
export default class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onSessionChange: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  render() {
    const { model } = this.props;

    return (
      <div>
        {model.prompt && (
          <div>
            {TEST}
            <p>Boilerplate Item</p>
            <PreviewPrompt prompt={model.prompt}/>
          </div>
        )}
      </div>
    );
  }
}

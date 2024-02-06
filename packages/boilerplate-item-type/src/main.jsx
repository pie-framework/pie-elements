import React from 'react';
import PropTypes from 'prop-types';
import { PreviewPrompt } from '@pie-element/pie-utils/render-ui';
import UTILS from '@pie-element/pie-utils';

const {test, callTest} = UTILS;

callTest('player');
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
            <p>{test}</p>
            <p>Boilerplate Item</p>
            <PreviewPrompt prompt={model.prompt}/>
          </div>
        )}
      </div>
    );
  }
}

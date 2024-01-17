import React from 'react';
import PropTypes from 'prop-types';
import { PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import {test, callTest} from 'pie-utils';

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

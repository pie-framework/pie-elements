import React from 'react';
import PropTypes from 'prop-types';
import {PreviewLayout} from '@pie-lib/render-ui';
import Matrix from './Matrix';

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onSessionChange: PropTypes.func
  };

  static defaultProps = {
    model: {},
    session: {},
  };

  render() {
    const {model, onSessionChange, session} = this.props;
    return (
      <PreviewLayout>
        <Matrix
          {...model}
          session={session}
          onSessionChange={onSessionChange}
        />
      </PreviewLayout>
    );
  }
}

export default Main;

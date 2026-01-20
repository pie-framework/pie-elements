import React from 'react';
import PropTypes from 'prop-types';

import PlacementOrdering from './placement-ordering';

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    session: PropTypes.oneOfType([PropTypes.array.isRequired, PropTypes.object.isRequired]),
    onSessionChange: PropTypes.func.isRequired,
  };

  render() {
    const { model, session, onSessionChange } = this.props;

    return (
      <PlacementOrdering model={model} session={session} onSessionChange={onSessionChange} />
    );
  }
}

export default Main;

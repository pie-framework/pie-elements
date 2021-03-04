import PlacementOrdering from './placement-ordering';
import React from 'react';
import { withDragContext } from '@pie-lib/drag';

import PropTypes from 'prop-types';

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    session: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.object.isRequired
    ]),
    onSessionChange: PropTypes.func.isRequired
  };

  render() {
    const { model, session, onSessionChange } = this.props;
    return (
      <PlacementOrdering
        model={model}
        session={session}
        onSessionChange={onSessionChange}
      />
    );
  }
}
const out = withDragContext(Main);
export default out;

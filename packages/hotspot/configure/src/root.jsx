import React from 'react';
import PropTypes from 'prop-types';

import Main from './main';

class Root extends React.Component {
  render() {
    const props = {
      configure: this.props.configure,
      disableSidePanel: this.props.disableSidePanel,
      model: this.props.model,
      onImageUpload: this.props.onImageUpload,
      onColorChanged: this.props.onColorChanged,
      onPartialScoringChanged: this.props.onPartialScoringChanged,
      onPromptChanged: this.props.onPromptChanged,
      onUpdateImageDimension: this.props.onUpdateImageDimension,
      onUpdateShapes: this.props.onUpdateShapes
    };

    return <Main {...props} />;
  }
}

Root.propTypes = {
  configure: PropTypes.object,
  disableSidePanel: PropTypes.bool,
  model: PropTypes.object.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onColorChanged: PropTypes.func.isRequired,
  onPartialScoringChanged: PropTypes.func.isRequired,
  onPromptChanged: PropTypes.func.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  onUpdateShapes: PropTypes.func.isRequired
};

export default Root;

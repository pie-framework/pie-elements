import React from 'react';
import PropTypes from 'prop-types';
import Design from './design';

export class Main extends React.Component {
  static propTypes = {
    configuration: PropTypes.object,
    className: PropTypes.string,
    onConfigurationChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.object,
    uploadSoundSupport: PropTypes.object,
  };

  static defaultProps = {};

  render() {
    const { model, onModelChanged, configuration, onConfigurationChanged, imageSupport, uploadSoundSupport } =
      this.props;

    return (
      <Design
        imageSupport={imageSupport}
        uploadSoundSupport={uploadSoundSupport}
        title="Design"
        model={model}
        configuration={configuration}
        onChange={onModelChanged}
        onConfigurationChanged={onConfigurationChanged}
      />
    );
  }
}

export default Main;

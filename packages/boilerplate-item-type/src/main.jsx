import React from 'react';
import PropTypes from 'prop-types';
import { PreviewPrompt, UiLayout } from '@pie-lib/pie-toolbox/render-ui';

export default class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onSessionChange: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  render() {
    const { model } = this.props;
    const { extraCSSRules } = model;

    return (
      <UiLayout extraCSSRules={extraCSSRules}>
        {model.prompt && (
          <div>
            <p>Boilerplate Item</p>
            <PreviewPrompt prompt={model.prompt}/>
          </div>
        )}
      </UiLayout>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import { PreviewLayout } from '@pie-lib/render-ui';
import MultipleChoice from './multiple-choice';

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    options: PropTypes.object,
    onChoiceChanged: PropTypes.func,
    onShowCorrectToggle: PropTypes.func,
    extraCSSRules: PropTypes.shape({
      names: PropTypes.arrayOf(PropTypes.string),
      rules: PropTypes.string,
    }),
  };

  static defaultProps = {
    model: {},
    session: {},
  };

  render() {
    const { model, onChoiceChanged, session, onShowCorrectToggle, options } = this.props;
    const { extraCSSRules, fontSizeFactor } = model;

    // model.partLabel is a property used for ebsr
    return (
      <PreviewLayout extraCSSRules={extraCSSRules} fontSizeFactor={fontSizeFactor} classes={{}}>
        <MultipleChoice
          {...model}
          options={options}
          session={session}
          onChoiceChanged={onChoiceChanged}
          onShowCorrectToggle={onShowCorrectToggle}
        />
      </PreviewLayout>
    );
  }
}

export default Main;

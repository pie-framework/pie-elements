import React from 'react';
import PropTypes from 'prop-types';

import Scale from './scale';
import Link from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';
import { color, UiLayout } from '@pie-lib/render-ui';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rubricOpen: false,
      linkPrefix: 'Show',
    };
    this.toggleRubric = this.toggleRubric.bind(this);
  }

  toggleRubric() {
    this.setState({ rubricOpen: !this.state.rubricOpen });
    this.setState({ linkPrefix: this.state.rubricOpen ? 'Show' : 'Hide' });
  }

  render() {
    const { model } = this.props;
    let { animationsDisabled } = this.props;
    const { extraCSSRules, halfScoring, scales, visible, pointLabels, description, standards, arrowsDisabled } =
      model || {};
    animationsDisabled = animationsDisabled || model.animationsDisabled;

    if (!scales || !visible) {
      return null;
    }

    const rubricItem = (
      <UiLayout
        extraCSSRules={extraCSSRules}
        style={{ fontFamily: 'Cerebri Sans', color: color.text(), backgroundColor: color.background() }}
      >
        {halfScoring ? (
          <div style={{ marginBottom: '16px' }}>* Half-point or in-between scores are permitted under this rubric.</div>
        ) : null}

        {scales.map((scale, scaleIndex) => (
          <Scale
            key={`scale_${scaleIndex}`}
            scale={scale}
            scaleIndex={scaleIndex}
            showPointsLabels={pointLabels}
            showDescription={description}
            showStandards={standards}
            arrowsDisabled={arrowsDisabled}
          />
        ))}
      </UiLayout>
    );

    if (animationsDisabled) {
      return rubricItem;
    }

    return (
      <UiLayout extraCSSRules={extraCSSRules} style={{ color: color.text(), backgroundColor: color.background() }}>
        <Link style={{ backgroundColor: color.background() }} href={this.dudUrl} onClick={this.toggleRubric}>
          {this.state.linkPrefix} Rubric
        </Link>
        <Collapse style={{ marginTop: '16px' }} in={this.state.rubricOpen} timeout="auto">
          {rubricItem}
        </Collapse>
      </UiLayout>
    );
  }
}

Main.propTypes = {
  model: PropTypes.shape({
    halfScoring: PropTypes.bool,
    scales: PropTypes.arrayOf(
      PropTypes.shape({
        excludeZero: PropTypes.bool,
        maxPoints: PropTypes.number,
        scorePointsLabels: PropTypes.arrayOf(PropTypes.string),
        traitLabel: PropTypes.string,
        traits: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            description: PropTypes.string,
            scorePointsDescriptors: PropTypes.arrayOf(PropTypes.string),
            standards: PropTypes.arrayOf(PropTypes.string),
          }),
        ),
      }),
    ),
    visible: PropTypes.bool,
    pointLabels: PropTypes.bool,
    description: PropTypes.bool,
    standards: PropTypes.bool,
    animationsDisabled: PropTypes.bool,
  }),
  animationsDisabled: PropTypes.bool,
};

export default Main;

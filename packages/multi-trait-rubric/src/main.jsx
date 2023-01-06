import React from 'react';
import PropTypes from 'prop-types';

import Scale from './scale';
import Link from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';

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
    const { model, animationsDisabled } = this.props;
    const { halfScoring, scales, visible, pointLabels, description, standards } = model || {};

    if (!scales || !visible) {
      return <div/>;
    }

    const rubricItem = (
      <div style={{ fontFamily: 'Cerebri Sans' }}>
        {halfScoring ? <p>* Half-point or in-between scores are permitted under this rubric.</p> : null}
        {scales.map((scale, scaleIndex) => (
          <Scale
            key={`scale_${scaleIndex}`}
            scale={scale}
            scaleIndex={scaleIndex}
            showPointsLabels={pointLabels}
            showDescription={description}
            showStandards={standards}
          />
        ))}
      </div>
    );

    return (
      <div>
        {!animationsDisabled ? (
          <React.Fragment>
            <Link href={this.dudUrl} onClick={this.toggleRubric}>
              {this.state.linkPrefix} Rubric
            </Link>
            <Collapse in={this.state.rubricOpen} timeout="auto">
              {rubricItem}
            </Collapse>
          </React.Fragment>
        ) : (
          rubricItem
        )}
      </div>
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
  }),
  animationsDisabled: PropTypes.bool,
};

export default Main;

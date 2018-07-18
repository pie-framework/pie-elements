import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Design from './design';
import Help from './help';
import React from 'react';
import ScoringConfig from '@pie-lib/scoring-config';
import { withDragContext } from '@pie-ui/placement-ordering';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

const styles = {
  tabBar: {
    display: 'flex',
    justifyContent: 'space-between'
  }
};

class Main extends React.Component {
  static propTypes = {
    initialModel: PropTypes.object,
    onModelChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      index: 0,
      model: props.initialModel
    };

    this.onTabIndexChange = (event, index) => {
      this.setState({ index });
    };

    this.onPartialScoringChange = partialScoring => {
      const { onModelChange } = this.props;
      const model = cloneDeep(this.state.model);
      model.partialScoring = partialScoring;
      this.setState({ model }, () => {
        onModelChange(this.state.model);
      });
    };

    this.onModelChange = model => {
      const { onModelChange } = this.props;
      const resetSession =
        model.placementType !== this.state.model.placementType ||
        model.choices.length !== this.state.model.choices.length;
      this.setState({ model }, () => {
        onModelChange(this.state.model, resetSession);
      });
    };
  }

  render() {
    const { classes, imageSupport } = this.props;
    const { index, model } = this.state;

    return (
      <div>
        <div className={classes.tabBar}>
          <Tabs onChange={this.onTabIndexChange} value={index}>
            <Tab label="Design" />
            <Tab label="Scoring" />
          </Tabs>
          <Help />
        </div>
        {index === 0 && (
          <Design
            model={model}
            onModelChange={this.onModelChange}
            imageSupport={imageSupport}
          />
        )}
        {index === 1 && (
          <ScoringConfig
            partialScoring={model.partialScoring}
            numberOfCorrectResponses={model.correctResponse.length}
            onChange={this.onPartialScoringChange}
          />
        )}
      </div>
    );
  }
}

export default withDragContext(withStyles(styles)(Main));

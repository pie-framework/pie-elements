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
    model: PropTypes.object,
    onModelChanged: PropTypes.func,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      model: props.model,
      index: 0
    };

    this.onTabIndexChange = (event, index) => {
      this.setState({ index });
    };

    this.onPartialScoringChange = partialScoring => {
      const { onModelChanged } = this.props;
      const model = cloneDeep(this.state.model);
      model.partialScoring = partialScoring;
      this.setState({ model }, () => {
        onModelChanged(this.state.model);
      });
    };
  }

  modelChanged = (reset) => {
    this.props.onModelChanged(this.state.model, reset);
  };

  updateModel = (model, reset) => {
    this.setState({ model }, () => {
      this.modelChanged(reset);
    });
  };

  render() {
    const { classes, imageSupport } = this.props;
    const { index, model } = this.state;

    return (
      <div>
        <div className={classes.tabBar}>
          <Tabs onChange={this.onTabIndexChange} value={index}>
            <Tab label="Design"/>
            <Tab label="Scoring"/>
          </Tabs>
          <Help />
        </div>
        {index === 0 && (
          <Design
            model={model}
            onModelChanged={this.onModelChanged}
            imageSupport={imageSupport}
            updateModel={this.updateModel}
          />
        )}
        {index === 1 && (
          <ScoringConfig
            partialScoring={!!model.partialScoring}
            numberOfCorrectResponses={model.correctResponse.length}
            onChange={this.onPartialScoringChange}
          />
        )}
      </div>
    );
  }
}

export default withDragContext(withStyles(styles)(Main));

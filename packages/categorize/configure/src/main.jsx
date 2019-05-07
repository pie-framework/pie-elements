import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Tabs } from '@pie-lib/config-ui';
import Design from './design';
import Scoring from './scoring';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    model: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.object
  };

  static defaultProps = {};

  changeScoring = scoring => {
    const { onModelChanged, model } = this.props;
    model.scoring = scoring;
    onModelChanged(model);
  };

  render() {
    const { classes, className, model, onModelChanged } = this.props;

    if (!model.scoring) {
      model.scoring = {
        weighting: {
          enabled: false,
          rules: []
        },
        partial: {
          enabled: false,
          rules: []
        }
      };
    }

    return (
      <div className={classNames(classes.main, className)}>
        <Tabs>
          <Design
            imageSupport={this.props.imageSupport}
            title="Design"
            model={model}
            onChange={onModelChanged}
          />
          <Scoring
            title="Scoring"
            scoring={model.scoring}
            categories={model.categories}
            correctResponse={model.correctResponse}
            onChange={this.changeScoring}
          />
        </Tabs>
      </div>
    );
  }
}
const styles = theme => ({
  main: {}
});

export default withStyles(styles)(Main);

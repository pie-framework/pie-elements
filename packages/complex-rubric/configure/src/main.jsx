import React from 'react';
import PropTypes from 'prop-types';
import { RUBRIC_TYPES } from '@pie-lib/rubric';
import { layout } from '@pie-lib/config-ui';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { withStyles } from '@material-ui/core/styles';
import { FormControlLabel } from '@material-ui/core';

const styles = {
  rubric: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    configuration: PropTypes.object,
    model: PropTypes.object,
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
  };

  onModelChanged = (model) => {
    const { onModelChanged } = this.props;

    return onModelChanged(model);
  };

  onChangeRubricType = (e) => {
    const { model } = this.props;

    const rubricType = e.target.value;
    this.onModelChanged({ ...model, rubricType });
  };

  render() {
    const { classes, model, configuration } = this.props;
    const { rubrics = {} } = model;
    let { rubricType }  = model;
    const { multiTraitRubric, simpleRubric } = configuration;
    let rubricTag = '';

    if (!rubricType) {
      rubricType = RUBRIC_TYPES.SIMPLE_RUBRIC;
    }

    switch (rubricType) {
      case RUBRIC_TYPES.SIMPLE_RUBRIC:
      default:
        rubricTag = (
          <rubric-configure
            id="simpleRubric"
            key="simple-rubric"
            ref={(ref) => {
              if (ref) {
                this.simpleRubric = ref;
                this.simpleRubric.model = rubrics.simpleRubric;
                this.simpleRubric.configuration = simpleRubric;
              }
            }}
          />
        );
        break;

      case RUBRIC_TYPES.MULTI_TRAIT_RUBRIC:
        rubricTag = (
          <multi-trait-rubric-configure
            id="multiTraitRubric"
            key="multi-trait-rubric"
            ref={(ref) => {
              if (ref) {
                this.multiTraitRubric = ref;
                this.multiTraitRubric.model = { ...rubrics.multiTraitRubric };
                this.multiTraitRubric.configuration = multiTraitRubric;
              }
            }}
          />
        );
        break;
    }

    return (
      <layout.ConfigLayout hideSettings={true} settings={null}>
        <div className={classes.rubric}>
          <div>
            <RadioGroup
              aria-label="rubric-type"
              name="rubricType"
              value={model.rubricType}
              onChange={this.onChangeRubricType}
            >
              <FormControlLabel
                value={RUBRIC_TYPES.SIMPLE_RUBRIC}
                control={<Radio checked={rubricType === RUBRIC_TYPES.SIMPLE_RUBRIC} />}
                label="Simple Rubric"
              />

              <FormControlLabel
                value={RUBRIC_TYPES.MULTI_TRAIT_RUBRIC}
                control={<Radio checked={rubricType === RUBRIC_TYPES.MULTI_TRAIT_RUBRIC} />}
                label="Multi Trait Rubric"
              />
            </RadioGroup>
          </div>

          <div>{rubricTag}</div>
        </div>
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Main);

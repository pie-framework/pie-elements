import React from 'react';
import PropTypes from 'prop-types';
import { RUBRIC_TYPES } from '@pie-lib/pie-toolbox/rubric';
import { layout } from '@pie-lib/pie-toolbox/config-ui';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { withStyles } from '@material-ui/core/styles';
import { FormControlLabel } from '@material-ui/core';

const styles = {};
const rubricLabels = {
  [RUBRIC_TYPES.MULTI_TRAIT_RUBRIC]: 'Multi Trait Rubric',
  [RUBRIC_TYPES.SIMPLE_RUBRIC]: 'Simple Rubric',
  [RUBRIC_TYPES.RUBRICLESS]: 'Rubricless',
};

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    canUpdateModel: PropTypes.bool,
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
    const { model, configuration, canUpdateModel } = this.props;

    const { rubrics = {} } = model || {};
    let { rubricType } = model;
    const { contentDimensions = {}, rubricOptions = [], multiTraitRubric, simpleRubric, rubricless, width } = configuration;
    let rubricTag = '';

    if (!rubricType) {
      rubricType = RUBRIC_TYPES.SIMPLE_RUBRIC;
    }

    const isRubricTypeAvailable =  rubricOptions.indexOf(rubricType) > -1;

    if (canUpdateModel) {
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
                  this.simpleRubric.model = {...rubrics.simpleRubric, errors: model.errors || {}};
                  this.simpleRubric.configuration = { ...simpleRubric, width };
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

                  this.multiTraitRubric.model = {...rubrics.multiTraitRubric, errors: model.errors || {} };
                  this.multiTraitRubric.configuration = { ...multiTraitRubric, width: width || multiTraitRubric.width };
                }
              }}
            />
          );
          break;

        case RUBRIC_TYPES.RUBRICLESS:
          rubricTag = (
              <rubric-configure
                  id="rubricless"
                  key="rubricless"
                  ref={(ref) => {
                    if (ref) {
                      this.rubricless = ref;

                      this.rubricless.model = rubrics.rubricless;
                      this.rubricless.configuration = { ...rubricless, width };
                    }
                  }}
              />
          );
          break;
      }
    }

    return (
      <layout.ConfigLayout dimensions={contentDimensions} hideSettings={true} settings={null}>
        <RadioGroup
          aria-label="rubric-type"
          name="rubricType"
          value={model.rubricType}
          onChange={this.onChangeRubricType}
        >
          {
            rubricOptions.length > 1 && rubricOptions.map((availableRubric, i)=>
              <FormControlLabel
                key={i}
                value={availableRubric}
                control={<Radio checked={rubricType === availableRubric} />}
                label={rubricLabels[availableRubric]}
            />
          )
          }
        </RadioGroup>

        {isRubricTypeAvailable && rubricTag}
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Main);

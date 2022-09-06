import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { settings, layout } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import { FormControlLabel } from '@material-ui/core';
import { withDragContext } from '@pie-lib/drag';

const {Panel, toggle} = settings;

const styles = {
  rubric: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0 32px'
  }
};

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    configuration: PropTypes.object,
    model: PropTypes.object,
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func
  };

  onModelChanged = (model) => {
    const {onModelChanged} = this.props;

    return onModelChanged(model);
  }

  onChangeRubricType = (e) => {
    const {model} = this.props;

    const rubricType = e.target.value;
    this.onModelChanged({
      ...model,
      rubricType,
    });
  };

  render() {
    const {
      classes,
      model,
      configuration,
      onConfigurationChanged
    } = this.props;
    const {rubricType, rubrics = {}} = model;
    const {multiTraitRubric} = configuration;
    const {
      showStandards,
      showExcludeZero,
      showLevelTagInput,
      showDescription,
      showVisibleToStudent,
      showHalfScoring,
      showScorePointLabels,
      dragAndDrop,
      spellCheck = {}
    } = multiTraitRubric || {};

    return (
      <div className={classes.design}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model.rubrics.multiTraitRubric}
              onChangeModel={this.onModelChanged}
              configuration={configuration.multiTraitRubric}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                Settings: {
                  standards: showStandards.settings && toggle(showStandards.label),
                  'showLevelTagInput.enabled': showLevelTagInput.settings && toggle(showLevelTagInput.label, true),
                  visibleToStudent: showVisibleToStudent.settings && toggle(showVisibleToStudent.label),
                  excludeZero: showExcludeZero.settings && toggle(showExcludeZero.label),
                  halfScoring: showHalfScoring.settings && toggle(showHalfScoring.label),
                  'dragAndDrop.enabled': dragAndDrop.settings && toggle(dragAndDrop.label, true)
                },
                Properties: {
                  description: showDescription.settings && toggle(showDescription.label),
                  pointLabels: showScorePointLabels.settings && toggle(showScorePointLabels.label),
                  spellCheckEnabled:
                    spellCheck.settings && toggle(spellCheck.label),
                }
              }}
            />
          }
        >
          <div>
            <div>
              <RadioGroup
                aria-label='rubric-type'
                name='rubricType'
                value={rubricType}
                defaultValue='simpleRubric'
                onChange={this.onChangeRubricType}
              >
                <FormControlLabel value={'simpleRubric'} control={<Radio/>} label='Simple Rubric'/>
                <FormControlLabel value={'multiTraitRubric'} control={<Radio/>} label='Multi Trait Rubric'/>
              </RadioGroup>
            </div>
            <div>
              {rubricType === 'simpleRubric' ? <rubric-configure
                id="simpleRubric"
                key="simple-rubric"
                ref={ref => {
                  if (ref) {
                    this.simpleRubric = ref;
                    this.simpleRubric._model = rubrics.simpleRubric
                  }
                }}
              /> : <multi-trait-rubric-configure
                id="multiTraitRubric"
                key="multi-trait-rubric"
                ref={ref => {
                  if (ref) {
                    this.multiTraitRubric = ref;
                    this.multiTraitRubric._model = {
                      ...rubrics.multiTraitRubric,
                      // disableDragContext: true
                    };
                    this.multiTraitRubric.configuration = multiTraitRubric;
                  }
                }}
              />}
            </div>
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

export default withDragContext(withStyles(styles)(Main));

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ChartConfig from '@pie-lib/charting-config';
import {
  FeedbackConfig,
  settings,
  layout
} from '@pie-lib/config-ui';
import PartialScoringConfig from '@pie-lib/scoring-config';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import GeneralConfigBlock from './general-config-block';

const { Panel, toggle, radio } = settings;
const log = debug('@pie-element:graph-lines:configure');

const styles = theme => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  content: {
    marginTop: theme.spacing.unit * 2
  }
});

export class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    classes: PropTypes.object,
    imageSupport: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
  };

  static defaultProps = {
    classes: {}
  };

  constructor(props) {
    super(props);

    this.defaults = JSON.parse(JSON.stringify(props.model));

    this.state = {
      activeTab: 0
    };
  }

  onTabChange = (event, value) => {
    this.setState({ activeTab: value });
  };

  onChangeTabIndex = index => {
    this.setState({ activeTab: index });
  };

  resetToDefaults = () => {
    this.props.onModelChanged(JSON.parse(JSON.stringify(this.defaults)));
  };

  onChange = graph => {
    this.props.model.graph = { ...graph };

    this.props.onModelChanged(this.props.model);
  };

  onRationaleChange = rationale => {
    const { onModelChanged, model } = this.props;

    onModelChanged({
      ...model,
      rationale
    });
  };

  onPromptChange = prompt => {
    const { onModelChanged, model } = this.props;

    onModelChanged({
      ...model,
      prompt
    });
  };

  onFeedbackChange = feedback => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  onAddLine = () => {
    const { model } = this.props;
    const newGraph = {
      ...model.graph,
      lines: model.graph.lines.concat({ initialView: '', correctLine: '', label: '' })
    };

    this.onChange(newGraph);
  };

  onMultipleToggle = event => {
    const { model, onModelChanged } = this.props;

    model.multiple = event.target.checked;

    if (!model.multiple && model.graph.lines.length > 1) {
      model.graph.lines.length = 1;
    }

    onModelChanged(model);
  };

  onPartialScoringChange = partialScoring => {
    this.props.model.partialScoring = partialScoring.map(partialScore => ({
      numberOfCorrect: partialScore.numberOfCorrect || '',
      scorePercentage: partialScore.scorePercentage || ''
    }));

    this.props.onModelChanged(this.props.model);
  };

  render() {
    const {
      classes,
      model,
      configuration,
      onConfigurationChanged,
      onModelChanged,
      imageSupport
    } = this.props;
    const config = model.graph;

    const {
      arrows = {},
      graphTitle = {},
      padding = {},
      labels = {},

      rationale = {},
      prompt = {},
      scoringType = {},
      studentInstructions = {},
      teacherInstructions = {},
    } = configuration || {};
    log('[render] model', model);

    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={onModelChanged}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              'Settings': {
                arrows: arrows.settings && toggle(arrows.label),
                'graphTitle.enabled': graphTitle.settings &&
                toggle(graphTitle.label, true),
                padding: padding.settings && toggle(padding.label),
                labels: labels.settings && toggle(labels.label),
              },
              'Properties': {
                teacherInstructionsEnabled: teacherInstructions.settings &&
                toggle(teacherInstructions.label),
                promptEnabled: prompt.settings &&
                  toggle(prompt.label),
                studentInstructionsEnabled: studentInstructions.settings &&
                toggle(studentInstructions.label),
                rationaleEnabled: rationale.settings && toggle(rationale.label),
                scoringType: scoringType.settings &&
                radio(scoringType.label, ['auto', 'rubric']),
              },
            }}
          />
        }
      >
        <div className={classes.content}>
          <Typography component="div" type="body1">
                <span>
                  This interaction asks a student to draw a line that meets specific criteria.
                  The student will draw the line by clicking on two points on the graph.
                </span>
            <h2>Lines</h2>
            <span>Line equations must be in y=mx+b form. Only whole number coordinates can be plotted.</span>
          </Typography>
          <GeneralConfigBlock
            onMultipleToggle={this.onMultipleToggle}
            onAddLine={this.onAddLine}
            onRationaleChange={this.onRationaleChange}
            onPromptChange={this.onPromptChange}
            multiple={model.multiple}
            config={config}
            configuration={configuration}
            rationale={model.rationale}
            rationaleEnabled={model && model.rationaleEnabled}
            promptEnabled={model && model.promptEnabled}
            onChange={this.onChange}
            imageSupport={imageSupport}
          />
          <ChartConfig
            config={config}
            onChange={this.onChange}
            resetToDefaults={this.resetToDefaults}
          />
          <PartialScoringConfig
            numberOfCorrectResponses={config.lines.length}
            partialScoring={!!model.partialScoring}
            onChange={this.onPartialScoringChange}
          />
          <FeedbackConfig
            allowPartial={false}
            feedback={model.feedback}
            onChange={this.onFeedbackChange}
          />
        </div>
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Configure);

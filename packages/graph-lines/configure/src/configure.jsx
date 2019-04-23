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

class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired
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
    const { classes, model } = this.props;
    const config = model.graph;

    const {
      configure: {
        arrows,
        graphTitle,
        padding,
        labels,

        rationale,
        scoringType,
        studentInstructions,
        teacherInstructions,
      }
    } = model;

    log('[render] model', model);


    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            onChange={this.props.onModelChanged}
            groups={{
              'Item Type': {
                arrows: arrows.settings && toggle(arrows.label),
                'configure.graphTitle.enabled': graphTitle.settings &&
                toggle(graphTitle.label),
                padding: padding.settings && toggle(padding.label),
                labels: labels.settings && toggle(labels.label),
              },
              'Properties': {
                'configure.teacherInstructions.enabled': teacherInstructions.settings &&
                toggle(teacherInstructions.label),
                'configure.studentInstructions.enabled': studentInstructions.settings &&
                toggle(studentInstructions.label),
                'configure.rationale.enabled': rationale.settings &&
                toggle(rationale.label),
                scoringType: scoringType.settings &&
                radio(scoringType.label, 'auto', 'rubric'),
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
            multiple={model.multiple}
            config={config}
            onChange={this.onChange}
          />
          <ChartConfig
            config={config}
            onChange={this.onChange}
            resetToDefaults={this.resetToDefaults}
          />
          <FeedbackConfig
            allowPartial={false}
            feedback={model.feedback}
            onChange={this.onFeedbackChange}
          />
        </div>
        <PartialScoringConfig
          numberOfCorrectResponses={config.lines.length}
          partialScoring={!!model.partialScoring}
          onChange={this.onPartialScoringChange}
        />
      </layout.ConfigLayout>
    );
  }
}

const ConfigureMain = withStyles(styles)(Configure);

class StateWrapper extends React.Component {
  static propTypes = {
    model: PropTypes.any,
    onModelChanged: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      model: props.model
    };

    this.onModelChanged = m => {
      this.setState({ model: m }, () => {
        this.props.onModelChanged(this.state.model);
      });
    };
  }

  render() {
    const { model } = this.state;
    return <ConfigureMain model={model} onModelChanged={this.onModelChanged} />;
  }
}

export default StateWrapper;

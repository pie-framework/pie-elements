import { InputCheckbox, FeedbackConfig, FormSection } from '@pie-lib/config-ui';
import NumberTextField from './number-text-field';
import CardBar from './card-bar';
import {
  NumberLineComponent,
  dataConverter,
  tickUtils
} from '@pie-ui/number-line';
import Size from './size';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Domain from './domain';
import Arrows from './arrows';
import PointConfig from './point-config';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { withStyles } from '@material-ui/core/styles';
import EditableHtml from '@pie-lib/editable-html';
import Ticks from './ticks';
import { model as defaultModel } from './defaults';

const trimModel = model => ({
  ...model,
  feedback: undefined,
  prompt: undefined,
  graph: { ...model.graph, title: undefined },
  correctResponse: undefined
});

const {
  lineIsSwitched,
  switchGraphLine,
  toGraphFormat,
  toSessionFormat
} = dataConverter;

const styles = theme => ({
  maxNumberOfPoints: {
    width: '150px'
  },
  checkbox: {
    marginTop: theme.spacing.unit * 2
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      paddingRight: theme.spacing.unit * 2
    }
  },
  hide: {
    opacity: 0.5
  },
  resetDefaults: {
    margin: '20px 0'
  },
  pointTypeChooser: {
    margin: '20px 0'
  },
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  section: {
    margin: 0,
    padding: 0
  }
});

export const toPointType = response => {
  function rest(response) {
    if (response.pointType) {
      if (response.direction) {
        return `${response.pointType[0]}${response.direction[0]}`;
      }
      return response.pointType[0];
    } else {
      return `${response.leftPoint[0]}${response.rightPoint[0]}`;
    }
  }
  return `${response.type[0]}${rest(response)}`.toUpperCase();
};

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  graphChange = o => {
    const { onChange } = this.props;
    const graph = { ...this.props.model.graph, ...o };
    onChange({ graph });
  };

  changeSize = ({ width, height }) => this.graphChange({ width, height });

  changeMaxNoOfPoints = (e, maxNumberOfPoints) =>
    this.graphChange({ maxNumberOfPoints });

  changeGraphTitle = title => this.graphChange({ title });

  changeTicks = ticks => {
    const { model, onChange } = this.props;
    const correctResponse = tickUtils.snapElements(
      model.graph.domain,
      ticks,
      model.correctResponse
    );
    const initialElements = tickUtils.snapElements(
      model.graph.domain,
      ticks,
      model.graph.initialElements
    );

    const graph = { ...this.props.model.graph, ticks, initialElements };
    onChange({ graph, correctResponse });
  };

  changeArrows = arrows => this.graphChange({ arrows });

  setDefaults = () => {
    this.props.onChange({ graph: cloneDeep(defaultModel.graph) });
  };

  exhibitChanged = (event, value) => {
    const graph = { ...this.props.model.graph, exhibitOnly: value };
    this.props.onChange({ graph });
  };

  moveCorrectResponse = (index, el, position) => {
    const { onChange, model } = this.props;
    el.position = position;
    const update = toSessionFormat(
      el.type === 'line' && lineIsSwitched(el) ? switchGraphLine(el) : el
    );
    const correctResponse = [...model.correctResponse];
    correctResponse[index] = update;
    onChange({ correctResponse });
  };

  moveInitialView = (index, el, position) => {
    const { model, onChange } = this.props;
    el.position = position;
    const update = toSessionFormat(
      el.type === 'line' && lineIsSwitched(el) ? switchGraphLine(el) : el
    );
    const initialElements = [...this.props.model.graph.initialElements];
    initialElements[index] = update;
    const graph = { ...model.graph, initialElements };
    onChange({ graph });
  };

  availableTypesChange = availableTypes => {
    const { model, onChange } = this.props;
    new Set(model.correctResponse.map(toPointType)).forEach(pointType => {
      availableTypes[pointType] = true;
    });
    const graph = { ...model.graph, availableTypes };
    onChange({ graph });
  };

  deleteCorrectResponse = indices => {
    const { model, onChange } = this.props;
    const correctResponse = model.correctResponse.filter((v, index) => {
      return !indices.some(d => d === index);
    });
    onChange({ correctResponse });
  };

  deleteInitialView = indices => {
    const { model, onChange } = this.props;
    const initialElements = model.graph.initialElements.filter((v, index) => {
      return !indices.some(d => d === index);
    });
    const graph = { ...model.graph, initialElements };
    onChange({ graph });
  };

  addCorrectResponse = data => {
    const { model, onChange } = this.props;
    const correctResponse = [...model.correctResponse];
    correctResponse.push(toSessionFormat(data));
    onChange({ correctResponse });
  };

  addInitialView = data => {
    const { onChange, model } = this.props;
    const graph = { ...model.graph };
    graph.initialElements = graph.initialElements || [];
    graph.initialElements.push(toSessionFormat(data));
    onChange({ graph });
  };

  render() {
    const { classes, model, onChange, configuration } = this.props;

    const { graph } = model;
    const { prompt = {} } = configuration || {};

    const correctResponse = cloneDeep(model.correctResponse || []).map(
      toGraphFormat
    );

    const initialView = cloneDeep(graph.initialElements || []).map(
      toGraphFormat
    );

    return (
      <div className={classes.root}>

        {prompt.settings && (
          <FormSection label={prompt.label}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={prompt => onChange({ prompt })}
              nonEmpty={false}
              disableUnderline
            />
          </FormSection>
        )}

        <CardBar header="Attributes">
          Set up the number line by entering the domain and number of tick marks
          to display. Labels on the number line can be edited or removed by
          clicking on the label.
        </CardBar>

        <div className={classes.row}>
          <FormSection label={'Size'}>
            <Size size={graph} onChange={this.changeSize} />
          </FormSection>

          <FormSection label={'Domain'}>
            <Domain
              domain={graph.domain}
              onChange={domain => this.graphChange({ domain })}
            />
          </FormSection>
        </div>
        <div className={classes.row}>
          <FormSection label={'Ticks'}>
            <Ticks
              ticks={graph.ticks}
              onChange={this.changeTicks}
              domain={graph.domain}
            />
          </FormSection>
          <FormSection label={'Arrows'}>
            <Arrows arrows={graph.arrows} onChange={this.changeArrows} />
          </FormSection>
        </div>
        <FormSection label={'Title'}>
          <EditableHtml
            markup={graph.title || ''}
            onChange={this.changeGraphTitle}
          />
        </FormSection>
        <FormSection label={'Limits'}>
          <NumberTextField
            className={classes.maxNumberOfPoints}
            label="Max No of Elements"
            min={1}
            max={20}
            value={graph.maxNumberOfPoints}
            onChange={this.changeMaxNoOfPoints}
          />
        </FormSection>
        <Button
          variant="outlined"
          mini
          color="primary"
          onClick={this.setDefaults}
        >
          Reset to default values
        </Button>
        <br />
        <br />

        {!graph.exhibitOnly && (
          <div>
            <CardBar header="Correct Response">
              Select answer type and place it on the number line. Intersecting
              points, line segments and/or rays will appear above the number
              line.{' '}
              <i>
                Note: A maximum of 20 points, line segments or rays may be
                plotted.
              </i>
            </CardBar>

            <NumberLineComponent
              onMoveElement={this.moveCorrectResponse}
              onDeleteElements={this.deleteCorrectResponse}
              onAddElement={this.addCorrectResponse}
              answer={correctResponse}
              //strip feedback for this model
              model={trimModel(model)}
            />
            <CardBar header="Available Types" mini>
              Click on the input options to be displayed to the students. All
              inputs will display by default.
            </CardBar>
            <div className={classes.pointTypeChooser}>
              <PointConfig
                onSelectionChange={this.availableTypesChange}
                selection={graph.availableTypes}
              />
            </div>
          </div>
        )}
        <CardBar header="Initial view/Make Exhibit">
          Use this number line to set a starting point, line segment or ray.
          This is optional. <br />
          This number line may also be used to make an exhibit number line,
          which can not be manipulated by a student.
        </CardBar>
        <NumberLineComponent
          onMoveElement={this.moveInitialView}
          onDeleteElements={this.deleteInitialView}
          onAddElement={this.addInitialView}
          answer={initialView}
          model={trimModel(model)}
        />
        <InputCheckbox
          label="Make exhibit"
          className={classes.checkbox}
          checked={graph.exhibitOnly}
          onChange={this.exhibitChanged}
          value={'exhibitOnly'}
        />

        {!graph.exhibitOnly && (
          <React.Fragment>
            <br />
            <FeedbackConfig
              feedback={model.feedback}
              onChange={feedback => onChange({ feedback })}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles, { name: 'Main' })(Main);

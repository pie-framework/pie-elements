import * as React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { GraphContainer as Graph } from '@pie-lib/graphing';
import { AlertDialog } from '@pie-lib/config-ui';
import { renderMath } from '@pie-lib/math-rendering';
import Delete from '@mui/icons-material/Delete';
import { set, isEqual } from 'lodash';
import { MenuItem, Select, Tooltip, Typography } from '@mui/material';
import Info from '@mui/icons-material/Info';

// custom grey values close to old v3 accents
const GREY_A100 = '#D5D5D5';
const GREY_A200 = '#AAAAAA';

const GraphingTools = styled('div')(({ theme }) => ({
  color: GREY_A200,
}));

const Button = styled('div')(({ theme }) => ({
  margin: `${theme.spacing(2.5)} 0`,
  cursor: 'pointer',
  background: theme.palette.grey[200],
  padding: theme.spacing(1.5),
  width: 'fit-content',
  borderRadius: '4px',
  '&:hover': {
    background: GREY_A100,
  },
}));

const AvailableTools = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  flexWrap: 'wrap',
}));

const AvailableTool = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  border: `2px solid ${theme.palette.common.white}`,
  textTransform: 'capitalize',
  '&:hover': {
    color: theme.palette.grey[800],
  },
}));

const SelectedTool = styled(AvailableTool)(({ theme }) => ({
  background: GREY_A100,
  border: `2px solid ${GREY_A200}`,
}));

const ResponseTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2.5),
}));

const IconButton = styled('div')(({ theme }) => ({
  marginLeft: '6px',
  color: theme.palette.grey[600],
  '&:hover': {
    cursor: 'pointer',
    color: theme.palette.common.black,
  },
}));

const Name = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
))(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
}));

const SubtitleText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
}));

const ToolsHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const DefaultTool = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '300px',
}));

const DefaultToolSelect = styled(Select)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  textTransform: 'uppercase',
  color: theme.palette.grey[800],
}));

const StyledMenuItem = styled(MenuItem)({
  textTransform: 'uppercase',
});

const ErrorMessage = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));

export const Tools = ({
  availableTools,
  defaultTool,
  hasErrors,
  toolbarTools,
  toggleToolBarTool,
  onDefaultToolChange,
}) => {
  let allTools = availableTools || [];
  const isLabelAvailable = allTools.includes('label');
  const toolbarToolsNoLabel = (toolbarTools || []).filter((tool) => tool !== 'label');

  if (isLabelAvailable) {
    // label has to be placed at the end of the list
    const allToolsNoLabel = allTools.filter((tool) => tool !== 'label');
    allTools = [...allToolsNoLabel, 'label'];
  }

  return (
    <GraphingTools>
      <ToolsHeader>
        <span>GRAPHING TOOLS</span>
        {toolbarToolsNoLabel.length > 0 && (
          <DefaultTool>
            <span>Default graphing tool:</span>
            <DefaultToolSelect
              variant="standard"
              onChange={onDefaultToolChange}
              value={defaultTool}
              disableUnderline
              MenuProps={{ transitionDuration: { enter: 225, exit: 195 } }}
            >
              {toolbarToolsNoLabel.map((tool, index) => (
                <StyledMenuItem key={index} value={tool}>
                  {tool}
                </StyledMenuItem>
              ))}
            </DefaultToolSelect>
          </DefaultTool>
        )}
      </ToolsHeader>
      <AvailableTools>
        {allTools.map((tool) => {
          const selected = toolbarTools.find((t) => t === tool);
          const ToolComponent = selected ? SelectedTool : AvailableTool;

          return (
            <ToolComponent
              key={tool}
              style={{
                ...(hasErrors && tool !== 'label' && { color: 'red' }),
              }}
              onClick={() => toggleToolBarTool(tool)}
            >
              {tool.toUpperCase()}
            </ToolComponent>
          );
        })}
      </AvailableTools>
    </GraphingTools>
  );
};

Tools.propTypes = {
  toolbarTools: PropTypes.arrayOf(PropTypes.string),
  toggleToolBarTool: PropTypes.func,
  availableTools: PropTypes.array,
  defaultTool: PropTypes.string,
  hasErrors: PropTypes.number,
  onDefaultToolChange: PropTypes.func,
};

export class CorrectResponse extends React.Component {
  static propTypes = {
    availableTools: PropTypes.array,
    errors: PropTypes.object,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    toolbarTools: PropTypes.arrayOf(PropTypes.String),
  };

  state = {
    dialog: {
      open: false,
    },
  };

  componentDidMount() {
    try {
      // eslint-disable-next-line react/no-find-dom-node
      const domNode = ReactDOM.findDOMNode(this);

      renderMath(domNode);
    } catch (e) {
      // Added try-catch block to handle "Unable to find node on an unmounted component" error from tests, thrown because of the usage of shallow
      console.error('DOM not mounted');
    }
  }

  handleAlertDialog = (open, callback) =>
    this.setState(
      {
        dialog: { open },
      },
      callback,
    );

  changeMarks = (key, marks) => {
    const { model, onChange } = this.props;

    set(model, `answers.${key}.marks`, marks);
    onChange(model);
  };

  filterMarks = (tool) => {
    const {
      model: { answers },
    } = this.props;

    return Object.entries(answers || {}).reduce((object, [key, answer]) => {
      object[key] = {
        ...answer,
        marks: (answer.marks || []).filter((mark) => mark.type !== tool),
      };

      return object;
    }, {});
  };

  changeToolbarTools = (toolbarTools) => {
    const { model, onChange } = this.props;
    model.toolbarTools = toolbarTools;

    onChange(model);
  };

  updateModel = (props) => {
    const { model, onChange } = this.props;

    onChange({
      ...model,
      ...props,
    });
  };

  toggleToolBarTool = (tool) => {
    const {
      model: { defaultTool, toolbarTools, answers = {} },
    } = this.props;
    const updatedToolbarTools = [...toolbarTools];
    let newDefaultTool = defaultTool;

    const index = toolbarTools.findIndex((t) => tool === t);

    if (index >= 0) {
      const updatedAnswers = this.filterMarks(tool);
      updatedToolbarTools.splice(index, 1);
      if (tool === defaultTool) {
        const toolbarToolsNoLabel = (updatedToolbarTools || []).filter((tool) => tool !== 'label');
        newDefaultTool = (toolbarToolsNoLabel.length && toolbarToolsNoLabel[0]) || '';
      }

      if (!isEqual(answers, updatedAnswers)) {
        this.setState({
          dialog: {
            open: true,
            title: 'Warning',
            text: `Correct answer includes one or more ${tool} objects and all of them will be deleted.`,
            onConfirm: () =>
              this.handleAlertDialog(
                false,
                this.updateModel({
                  toolbarTools: updatedToolbarTools,
                  answers: updatedAnswers,
                  defaultTool: newDefaultTool,
                }),
              ),
            onClose: () => this.handleAlertDialog(false),
          },
        });

        return;
      }
    } else {
      updatedToolbarTools.push(tool);

      if (defaultTool === '' && tool !== 'label') {
        newDefaultTool = tool;
      }
    }

    this.updateModel({
      toolbarTools: updatedToolbarTools,
      defaultTool: newDefaultTool,
    });
  };

  onDefaultToolChange = (event) => {
    const { value } = event.target;

    this.updateModel({ defaultTool: value });
  };

  addAlternateResponse = () => {
    const { model, onChange } = this.props;
    const { answers } = model || {};
    const answersKeys = Object.keys(answers || {});

    set(model, `answers.${`alternate${answersKeys.length}`}`, {
      name: `Alternate ${answersKeys.length}`,
      marks: [],
    });
    onChange(model);
  };

  deleteAlternateResponse = (answerKey, answer) => {
    const { model, onChange } = this.props;
    const { answers } = model || {};
    const { marks = [], name } = answer || {};

    const deleteAnswer = () => {
      delete answers[answerKey];
      // rebuild answers based on new alternate positions after deletion
      const newAnswers = Object.entries(answers).reduce((acc, currentValue, index) => {
        const [key, value] = currentValue;
        const newAnswer =
          key === 'correctAnswer'
            ? { ...acc, [key]: value }
            : { ...acc, ['alternate' + index]: { ...value, name: `Alternate ${index}` } };
        return newAnswer;
      }, {});

      onChange({ ...model, answers: newAnswers });
    };

    if (marks.length) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: `${name} includes one or more shapes and the entire response will be deleted.`,
          onConfirm: () => this.handleAlertDialog(false, deleteAnswer),
          onClose: () => this.handleAlertDialog(false),
        },
      });

      return;
    }

    deleteAnswer();
  };

  render() {
    const { availableTools, errors, model, mathMlOptions = {}, removeIncompleteTool } = this.props;
    const { dialog } = this.state;
    const {
      answers = {},
      arrows,
      backgroundMarks,
      coordinatesOnHover,
      defaultTool,
      domain,
      graph = {},
      labels,
      labelsEnabled,
      range,
      title,
      titleEnabled,
      toolbarTools,
    } = model || {};
    const { correctAnswerErrors = {}, toolbarToolsError } = errors || {};

    return (
      <div>
        <Typography component="div" variant="h6">
          Define Tool Set and Correct Response
        </Typography>

        <SubtitleText component="div" variant="body1">
          Use this interface to choose which graphing tools students will be able to use, and to define the correct
          answer
        </SubtitleText>

        <Tools
          availableTools={availableTools}
          defaultTool={defaultTool}
          hasErrors={!!toolbarToolsError}
          onDefaultToolChange={this.onDefaultToolChange}
          toggleToolBarTool={this.toggleToolBarTool}
          toolbarTools={toolbarTools}
        />

        {toolbarToolsError && <ErrorMessage>{toolbarToolsError}</ErrorMessage>}

        {Object.entries(answers || {}).map(([key, answer]) => {
          const { marks = [], name } = answer || {};

          return (
            <React.Fragment key={`correct-response-graph-${name}`}>
              <ResponseTitle>
                <Name>{name}</Name>
                {key === 'correctAnswer' && (
                  <StyledTooltip
                    disableFocusListener
                    disableTouchListener
                    placement={'right'}
                    title={'At least 1 graph object should be defined.'}
                  >
                    <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '8px', marginBottom: 'auto' }} />
                  </StyledTooltip>
                )}
                {key !== 'correctAnswer' && (
                  <IconButton onClick={() => this.deleteAlternateResponse(key, answer)}>
                    <Delete />
                  </IconButton>
                )}
              </ResponseTitle>

              <Graph
                style={correctAnswerErrors[key] && { border: '2px solid red' }}
                axesSettings={{ includeArrows: arrows }}
                backgroundMarks={backgroundMarks.filter((mark) => !mark.building)}
                coordinatesOnHover={coordinatesOnHover}
                disabledLabels={true}
                disabledTitle={true}
                domain={domain}
                draggableTools={key === 'correctAnswer'}
                labels={labels}
                marks={marks}
                onChangeMarks={(newMarks) => this.changeMarks(key, newMarks)}
                range={range}
                showLabels={labelsEnabled}
                showTitle={titleEnabled}
                size={{ width: graph.width, height: graph.height }}
                title={title}
                toolbarTools={toolbarTools}
                onChangeTools={(toolbarTools) => this.updateModel({ toolbarTools })}
                mathMlOptions={mathMlOptions}
                removeIncompleteTool={removeIncompleteTool}
                limitLabeling={true}
              />

              {correctAnswerErrors[key] && <ErrorMessage>{correctAnswerErrors[key]}</ErrorMessage>}
            </React.Fragment>
          );
        })}

        <Button onClick={this.addAlternateResponse}>
          ADD ALTERNATE
        </Button>

        <AlertDialog
          open={dialog.open}
          title={dialog.title}
          text={dialog.text}
          onClose={dialog.onClose}
          onConfirm={dialog.onConfirm}
        />
      </div>
    );
  }
}

export default CorrectResponse;

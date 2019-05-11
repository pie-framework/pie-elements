import * as React from 'react';
import { InputContainer, InputCheckbox } from '@pie-lib/config-ui';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import AddLineButton from './add-line';
import { withStyles } from '@material-ui/core/styles';
import EditableHtml from '@pie-lib/editable-html';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column'
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  inputItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  exhibitOnly: {
    flex: 'initial',
    width: '50%'
  },
  input: {
    width: '90%'
  },
  rationale: {
    paddingTop: theme.spacing.unit * 2,
  },
  equationLabel: {
    marginRight: theme.spacing.unit
  },
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  optionsCheckbox: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
});

export class GeneralConfigBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    onAddLine: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onMultipleToggle: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
    configuration: PropTypes.object,
    rationale: PropTypes.string,
    imageSupport: PropTypes.object,
    onRationaleChange: PropTypes.func
  };

  static defaultProps = {
    configuration: {}
  };

  onChange = (name, isBoolean) => event => {
    const { config, onChange } = this.props;
    const newConfig = { ...config };

    newConfig[name] = isBoolean ? event.target.checked : event.target.value;

    onChange(newConfig, name);
  };

  onLineChange = (lineIndex, name) => event => {
    const { config, onChange } = this.props;
    const newConfig = { ...config };

    newConfig.lines[lineIndex][name] = event.target.value;

    onChange(newConfig, name);
  };

  render() {
    const {
      classes,
      config,
      multiple,
      onAddLine,
      onMultipleToggle,
      configuration,
      rationale,
      imageSupport,
      onRationaleChange
    } = this.props;
    const { rationale: cRationale } = configuration || {};

    return (
      <div className={classes.container}>
        {config.lines.map((line, idx) => (
          <div key={idx} className={classes.inputContainer}>
            <div className={classes.inputItem}>
              <InputContainer label="Line Label">
                <Input
                  type="text"
                  className={classes.input}
                  onChange={this.onLineChange(idx, 'label')}
                  value={line.label || ''}
                  placeholder="Enter Value"
                />
              </InputContainer>
            </div>
            {!config.exhibitOnly && <div className={classes.inputItem}>
              <Typography type="body1">
                <span className={classes.equationLabel}>y = </span>
              </Typography>
              <InputContainer label="Correct Line">
                <Input
                  type="text"
                  className={classes.input}
                  onChange={this.onLineChange(idx, 'correctLine')}
                  value={line.correctLine || ''}
                  placeholder="Enter Value"
                />
              </InputContainer>
            </div>}

            <div className={classnames(classes.inputItem, { [classes.exhibitOnly]: config.exhibitOnly })}>
              <Typography type="body1">
                <span className={classes.equationLabel}>y = </span>
              </Typography>
              <InputContainer label="Initial View">
                <Input
                  type="text"
                  className={classes.input}
                  onChange={this.onLineChange(idx, 'initialView')}
                  value={line.initialView || ''}
                  placeholder="Enter Value"
                />
              </InputContainer>
            </div>
          </div>
        ))}
        {multiple && <AddLineButton onAddClick={onAddLine} />}
        <div className={classes.checkboxContainer}>
          <div className={classes.optionsCheckbox}>
            <InputCheckbox
              label="Multiple Line Graph"
              checked={multiple}
              onChange={onMultipleToggle}/>
          </div>
          <div className={classes.optionsCheckbox}>
            <InputCheckbox
              label="Make this graph an exhibit only"
              checked={config.exhibitOnly || false}
              onChange={this.onChange('exhibitOnly', true)}/>
          </div>
        </div>
        {cRationale.enabled && (
          <InputContainer
            label={cRationale.label || 'Rationale'}
          >
            <EditableHtml
              className={classes.rationale}
              markup={rationale || ''}
              onChange={onRationaleChange}
              imageSupport={imageSupport}
            />
          </InputContainer>)
        }
      </div>
    );
  }
}

export default withStyles(styles)(GeneralConfigBlock);

import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import DeleteControl from './delete';
import AddControl from './add-point';
import Box from './box';

const styles = theme => ({
  pointsColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  pointsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  pointInput: {
    display: 'flex',
    width: '10%',
    margin: theme.spacing.unit * 2,
    marginTop: 0,
  },
  maxInputContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  maxInput: {
    display: 'flex',
    width: '30px',
    margin: 0,
    marginLeft: theme.spacing.unit * 2,
  },
});

class PointConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    withLabels: PropTypes.bool,
    model: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    addPoint: PropTypes.func.isRequired,
    onMaxPointsChange: PropTypes.func.isRequired,
    deletePoint: PropTypes.func.isRequired,
    onPointValueChange: PropTypes.func.isRequired,
    onPointLabelChange: PropTypes.func.isRequired
  };

  render() {
    const {
      classes,
      withLabels,
      model,
      config,
      addPoint,
      onMaxPointsChange,
      deletePoint,
      onPointValueChange,
      onPointLabelChange
    } = this.props;

    return (
      <Box>
        <div className={classes.pointsColumnContainer}>
          {model.correctResponse.length === 0 && <Typography>There are currently no points added.</Typography>}
          {model.correctResponse.map((point, index) => {
            const [pointX, pointY] = point.split(',');

            return (
              <div className={classes.pointsRow} key={index}>
                <b>(</b>
                <Input
                  inputProps={{
                    min: config.domainMin,
                    max: config.domainMax
                  }}
                  className={classes.pointInput}
                  type="number"
                  onChange={onPointValueChange(index, 0)}
                  value={pointX}
                  placeholder="Enter Value"
                />
                <b>,</b>
                <Input
                  inputProps={{
                    min: config.rangeMin,
                    max: config.rangeMax
                  }}
                  className={classes.pointInput}
                  type="number"
                  onChange={onPointValueChange(index, 1)}
                  value={pointY}
                  placeholder="Enter Value"
                />
                <b>)</b>
                {withLabels && <Input
                  className={classes.pointInput}
                  type="text"
                  onChange={onPointLabelChange(index)}
                  value={config.pointLabels[index]}
                  placeholder="Enter Value"
                />}
                <DeleteControl onDeleteClick={deletePoint(index)} disabled={false}/>
              </div>
            );
          })}
          <AddControl onAddClick={addPoint}/>
          <div className={classes.maxInputContainer}>
            <Typography type="body1">
              Maximum number of points a student is allowed to plot (optional):
            </Typography>
            <Input
              inputProps={{
                min: 0,
                max: 20
              }}
              className={classes.maxInput}
              type="number"
              onChange={onMaxPointsChange}
              value={config.maxPoints}
              placeholder="Enter Value"
            />
          </div>
        </div>
      </Box>
    );
  }
}

export default withStyles(styles)(PointConfig);

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';

const styles = (theme) => ({
  responseArea: {
    paddingBottom: theme.spacing.unit * 2.5,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
});

class ResponseAreaComponent extends React.Component {
  static propTypes = {
    editableHtmlProps: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    responseAreasError: PropTypes.string,
    responseAreaChoicesError: PropTypes.string,
  };

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  render() {
    const { editableHtmlProps, responseAreasError, responseAreaChoicesError, classes } = this.props;

    return (
      <div className={classes.responseArea}>
        <EditableHtml {...editableHtmlProps} />
        {responseAreasError && <div className={classes.errorText}>{responseAreasError}</div>}
        {responseAreaChoicesError && <div className={classes.errorText}>{responseAreaChoicesError}</div>}
      </div>
    );
  }
}

export default withStyles(styles)(ResponseAreaComponent);

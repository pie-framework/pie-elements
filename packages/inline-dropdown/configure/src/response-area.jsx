import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import EditableHtml from '@pie-lib/editable-html';
import { renderMath } from '@pie-lib/math-rendering';

const ResponseArea = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(2.5),
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

class ResponseAreaComponent extends React.Component {
  static propTypes = {
    editableHtmlProps: PropTypes.object.isRequired,
    responseAreasError: PropTypes.string,
    responseAreaChoicesError: PropTypes.string,
  };

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  render() {
    const { editableHtmlProps, responseAreasError, responseAreaChoicesError } = this.props;

    return (
      <ResponseArea>
        <EditableHtml {...editableHtmlProps} />
        {responseAreasError && <ErrorText>{responseAreasError}</ErrorText>}
        {responseAreaChoicesError && <ErrorText>{responseAreaChoicesError}</ErrorText>}
      </ResponseArea>
    );
  }
}

export default ResponseAreaComponent;

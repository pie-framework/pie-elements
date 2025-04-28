import React from 'react';
import PropTypes from 'prop-types';

class StaticHTMLSpan extends React.PureComponent {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { html, className } = this.props;

    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
}

StaticHTMLSpan.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string,
};

StaticHTMLSpan.defaultProps = {
  className: '',
};

export default StaticHTMLSpan;

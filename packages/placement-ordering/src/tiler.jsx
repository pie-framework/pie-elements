import PropTypes from 'prop-types';
import React from 'react';
import Tile from './tile';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const common = {
  tiler: {
    display: 'grid'
  },
  withGap: {
    gridGap: '10px'
  }
};

const types = {
  choiceLabel: PropTypes.string,
  targetLabel: PropTypes.string,
  disabled: PropTypes.bool,
  onDropChoice: PropTypes.func.isRequired,
  tiles: PropTypes.array.isRequired,
  tileSize: PropTypes.string,
  addGuide: PropTypes.bool
};

const defaults = {
  tileSize: '1fr',
  disabled: false,
  addGuide: false
};

const buildTiles = props => {
  const T = (tile, index) => {
    tile.onDropChoice = (source, index) =>
      props.onDropChoice(tile, source, index);
    tile.onRemoveChoice = () => props.onRemoveChoice(tile);
    tile.instanceId = props.instanceId;
    tile.disabled = props.disabled;
    tile.guideIndex = props.addGuide ? tile.index + 1 : undefined;

    if(props.includeTargets) {
      return <Tile {...tile} key={index} />;
    }
    else {
      return tile.type === 'choice' ? <Tile {...tile} key={index}/> : <Tile {...tile} label='' key={index}/>;
    }
  };

  T.propTypes = { ...types };
  return T;
};

class HTiler extends React.Component {
  static propTypes = { ...types };
  static defaultProps = { ...defaults };
  render() {
    const {
      includeTargets,
      choiceLabelEnabled,
      choiceLabel,
      targetLabel,
      tiles,
      classes,
      tileSize
    } = this.props;

    const rows = includeTargets
      ? `auto ${tileSize} auto ${tileSize}`
      : `auto ${tileSize} auto`;
    const columns = includeTargets ? tiles.length / 2 : tiles.length;

    const style = {
      gridTemplateColumns: includeTargets ?
        `repeat(${columns}, ${tileSize})` :
        `auto repeat(${Math.floor(columns / 2) - 1}, ${tileSize} 10px) ${tileSize} auto`,
      gridTemplateRows: rows
    };

    const labelStyle = {
      gridColumn: `1/${columns + 1}`
    };

    const names = classNames(
      classes.htiler,
      includeTargets ? classes.withGap : null
    );

    return (
      <div className={names} style={style}>
        <div
          className={classes.choiceLabel}
          style={labelStyle}
          dangerouslySetInnerHTML={{ __html: choiceLabelEnabled ? choiceLabel : '' }}
        />

        {includeTargets && (
          <div
            className={classes.targetLabel}
            style={labelStyle}
            dangerouslySetInnerHTML={{ __html: targetLabel }}
          />
        )}
        {tiles.map(buildTiles(this.props))}
      </div>
    );
  }
}

const horizontalStyles = {
  htiler: common.tiler,
  choiceLabel: {
    textAlign: 'center'
  },
  targetLabel: {
    textAlign: 'center',
    gridRow: '3/4'
  },
  withGap: {
    gridGap: '10px'
  }
};

export const HorizontalTiler = withStyles(horizontalStyles)(HTiler);

class VTiler extends React.Component {
  static propTypes = { ...types };
  static defaultProps = { ...defaults };
  render() {
    const {
      includeTargets,
      choiceLabelEnabled,
      choiceLabel,
      targetLabel,
      tiles,
      classes,
      tileSize
    } = this.props;

    const columns = includeTargets ? 2 : 1;
    const rows = includeTargets ? tiles.length / 2 : tiles.length;

    const style = {
      gridTemplateColumns: `repeat(${columns}, ${tileSize})`,
      gridTemplateRows: includeTargets ?
        `auto repeat(${rows}, ${tileSize})` :
        `auto auto repeat(${Math.floor(rows / 2) - 1}, ${tileSize} 10px) ${tileSize} auto`
    };

    const names = classNames(
      classes.vtiler,
      includeTargets ? classes.withGap : null
    );

    return (
      <div className={names} style={style}>
        <div
          className={classes.choiceLabel}
          dangerouslySetInnerHTML={{ __html: choiceLabelEnabled ? choiceLabel : '' }}
        />

        {includeTargets && (
          <div
            className={classes.targetLabel}
            dangerouslySetInnerHTML={{ __html: targetLabel }}
          />
        )}
        {tiles.map(buildTiles(this.props))}
      </div>
    );
  }
}

const verticalStyles = {
  vtiler: { gridAutoFlow: 'column', ...common.tiler },
  choiceLabel: {
    gridColumn: '1/2',
    textAlign: 'center'
  },
  targetLabel: {
    gridColumn: '2/3',
    textAlign: 'center'
  },
  withGap: {
    gridGap: '10px'
  }
};

export const VerticalTiler = withStyles(verticalStyles)(VTiler);

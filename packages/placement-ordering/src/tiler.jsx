import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/material/styles';

import Tile from './tile';

const types = {
  choiceLabel: PropTypes.string,
  targetLabel: PropTypes.string,
  disabled: PropTypes.bool,
  tiles: PropTypes.array.isRequired,
  tileSize: PropTypes.string,
  addGuide: PropTypes.bool,
};

const defaults = {
  tileSize: '1fr',
  disabled: false,
  addGuide: false,
};

const buildTiles = (props) => {
  const T = (tile, index) => {
    tile.instanceId = props.instanceId;
    tile.disabled = props.disabled;
    tile.guideIndex = props.addGuide ? tile.index + 1 : undefined;

    if (props.includeTargets) {
      return <Tile {...tile} key={index} />;
    } else {
      return tile.type === 'choice' ? <Tile {...tile} key={index} /> : <Tile {...tile} label="" key={index} />;
    }
  };

  T.propTypes = { ...types };
  return T;
};

const StyledHTilerContainer = styled('div')(({ theme, includeTargets }) => ({
  display: 'grid',
  paddingBottom: theme.spacing(2),
  ...(includeTargets && {
    gridGap: '10px',
  }),
}));

const StyledChoiceLabel = styled('div')({
  textAlign: 'center',
});

const StyledTargetLabel = styled('div')({
  textAlign: 'center',
  gridRow: '3/4',
});

const StyledVTilerContainer = styled('div')(({ includeTargets }) => ({
  gridAutoFlow: 'column',
  display: 'grid',
  ...(includeTargets && {
    gridGap: '10px',
  }),
}));

const StyledVChoiceLabel = styled('div')({
  gridColumn: '1/2',
  textAlign: 'center',
});

const StyledVTargetLabel = styled('div')({
  gridColumn: '2/3',
  textAlign: 'center',
});

export class HorizontalTiler extends React.Component {
  static propTypes = { ...types };
  static defaultProps = { ...defaults };
  render() {
    const { includeTargets, choiceLabelEnabled, choiceLabel, targetLabel, tiles, tileSize } = this.props;

    const rows = includeTargets ? `auto ${tileSize} auto ${tileSize}` : `auto ${tileSize} auto`;
    const columns = includeTargets ? tiles.length / 2 : tiles.length;

    const style = {
      gridTemplateColumns: includeTargets
        ? `repeat(${columns}, ${tileSize})`
        : `auto repeat(${Math.floor(columns / 2) - 1}, ${tileSize} 10px) ${tileSize} auto`,
      gridTemplateRows: rows,
    };

    const labelStyle = {
      gridColumn: `1/${columns + 1}`,
    };

    return (
      <StyledHTilerContainer includeTargets={includeTargets} style={style}>
        <StyledChoiceLabel
          style={labelStyle}
          dangerouslySetInnerHTML={{ __html: choiceLabelEnabled ? choiceLabel : '' }}
        />
        {includeTargets && (
          <StyledTargetLabel style={labelStyle} dangerouslySetInnerHTML={{ __html: targetLabel }} />
        )}
        {tiles.map(buildTiles(this.props))}
      </StyledHTilerContainer>
    );
  }
}

export class VerticalTiler extends React.Component {
  static propTypes = { ...types };
  static defaultProps = { ...defaults };
  render() {
    const { includeTargets, choiceLabelEnabled, choiceLabel, targetLabel, tiles, tileSize } = this.props;

    const columns = includeTargets ? 2 : 1;
    const rows = includeTargets ? tiles.length / 2 : tiles.length;

    const style = {
      gridTemplateColumns: `repeat(${columns}, ${tileSize})`,
      gridTemplateRows: includeTargets
        ? `auto repeat(${rows}, ${tileSize})`
        : `auto auto repeat(${Math.floor(rows / 2) - 1}, ${tileSize} 10px) ${tileSize} auto`,
    };

    return (
      <StyledVTilerContainer includeTargets={includeTargets} style={style}>
        <StyledVChoiceLabel
          dangerouslySetInnerHTML={{ __html: choiceLabelEnabled ? choiceLabel : '' }}
        />

        {includeTargets && <StyledVTargetLabel dangerouslySetInnerHTML={{ __html: targetLabel }} />}
        {tiles.map(buildTiles(this.props))}
      </StyledVTilerContainer>
    );
  }
}

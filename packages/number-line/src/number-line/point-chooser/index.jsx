import React from 'react';

import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button from './button';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

const iconHeight = 41;
const iconWidth = 42;
import img from './img';

const StyledDeleteIcon = styled('svg')({
  fill: 'black',
  cursor: 'pointer',
  transition: 'opacity 100ms linear',
  '&:hover': {
    opacity: '0.5',
  },
});

const DeleteIcon = () => {
  return (
    <StyledDeleteIcon
      fill="#000000"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </StyledDeleteIcon>
  );
};

const iconIndexMap = {
  pf: 0,
  lff: 1,
  lef: 2,
  lfe: 3,
  lee: 4,
  rfn: 5,
  rfp: 6,
  ren: 7,
  rep: 8,
};

const StyledPointLink = styled('a')(({ $iconIndex, $active }) => ({
  display: 'inline-block',
  width: iconWidth,
  height: iconHeight,
  position: 'relative',
  top: '1px',
  cursor: 'pointer',
  background: `url(${img}) -${$iconIndex * iconWidth}px 0px`,
  ...($active && {
    backgroundPosition: `-${$iconIndex * iconWidth}px -${2 * iconHeight}px`,
  }),
  '&:hover': {
    textDecoration: 'none',
    backgroundPosition: `-${$iconIndex * iconWidth}px -${iconHeight}px`,
  },
  ...($active && {
    '&:hover': {
      backgroundPosition: `-${$iconIndex * iconWidth}px -${2 * iconHeight}px`,
    },
  }),
}));

const RawPoint = (props) => {
  const { iconKey, active, onClick } = props;
  const iconIndex = iconIndexMap[iconKey.toLowerCase()] ?? 0;
  return (
    <span role="presentation" key={iconKey} onClick={onClick}>
      <StyledPointLink $iconIndex={iconIndex} $active={active}>&nbsp;</StyledPointLink>
    </span>
  );
};

RawPoint.propTypes = {
  iconKey: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

export const Point = RawPoint;

const ElementSelector = styled('div')({
  width: '55%',
  padding: '1px',
  '-webkit-touch-callout': 'none',
  '-webkit-user-select': 'none',
  '-khtml-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none',
});

const Points = ({ selectPoint, selected, icons }) => {
  const iconTags = icons.map((key) => {
    let active = key === selected;
    let onClick = active ? () => {} : selectPoint.bind(null, key);
    return <Point key={key.toLowerCase()} iconKey={key.toLowerCase()} active={active} onClick={onClick} />;
  });

  return <ElementSelector>{iconTags}</ElementSelector>;
};

Points.propTypes = {
  selectPoint: PropTypes.func.isRequired,
  selected: PropTypes.string,
  icons: PropTypes.array,
};

const PointChooserContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '4px',
  padding: '1px',
});

const Controls = styled('div')({
  display: 'flex',
  paddingTop: '7px',
});

const DeleteIconHolder = styled('span')({
  position: 'relative',
  top: '3px',
  width: '30px',
});

export class PointChooser extends React.Component {
  static defaultProps = {
    showDeleteButton: false,
    elementType: PointChooser.DEFAULT_TYPE,
    icons: ['pf', 'lff', 'lef', 'lfe', 'lee', 'rfn', 'rfp', 'ren', 'rep'],
  };

  static propTypes = {
    elementType: PropTypes.string,
    showDeleteButton: PropTypes.bool,
    onDeleteClick: PropTypes.func.isRequired,
    onElementType: PropTypes.func.isRequired,
    onUndoElement: PropTypes.func.isRequired,
    onClearElements: PropTypes.func.isRequired,
    icons: PropTypes.array,
    language: PropTypes.string,
  };

  render() {
    const {
      elementType,
      showDeleteButton,
      onDeleteClick,
      onUndoElement,
      onClearElements,
      icons,
      onElementType,
      language,
    } = this.props;

    return (
      <PointChooserContainer>
        <Points selected={elementType} selectPoint={onElementType} icons={icons} />
        <Controls>
          {showDeleteButton && (
            <DeleteIconHolder onClick={onDeleteClick}>
              <DeleteIcon />
            </DeleteIconHolder>
          )}
          <Button
            onClick={onUndoElement}
            label={translator.t('common:undo', { lng: language })}
          />
          <Button
            onClick={onClearElements}
            label={translator.t('numberLine.clearAll', { lng: language })}
          />
        </Controls>
      </PointChooserContainer>
    );
  }
}

export default PointChooser;

PointChooser.DEFAULT_TYPE = 'pf';

const iconHeight = 41;
const iconWidth = 42;

import img from './img';

const noselect = () => ({
  '-webkit-touch-callout': 'none' /* iOS Safari */,
  '-webkit-user-select': 'none' /* Safari */,
  '-khtml-user-select': 'none' /* Konqueror HTML */,
  '-moz-user-select': 'none' /* Firefox */,
  '-ms-user-select': 'none' /* Internet Explorer/Edge */,
  'user-select':
    'none' /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
});

const styleElement = index => ({
  display: 'inline-block',
  width: iconWidth,
  height: iconHeight,
  position: 'relative',
  top: '1px',
  cursor: 'pointer',
  background: `url(${img}) -${index * iconWidth}px 0px`,
  '&.active, &.active:hover': {
    backgroundPosition: `-${index * iconWidth}px -${2 * iconHeight}px`
  },
  '&:hover': {
    textDecoration: 'none',
    backgroundPosition: `-${index * iconWidth}px -${iconHeight}px`
  }
});

export default {
  pointChooser: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: '4px',
    padding: '1px'
  },
  deleteIconHolder: {
    position: 'relative',
    top: '3px',
    width: '30px'
  },
  deleteIcon: {
    fill: 'black',
    cursor: 'pointer',
    transition: 'opacity 100ms linear',
    '&:hover': {
      opacity: '0.5'
    }
  },
  elementSelector: Object.assign(
    {
      width: '55%',
      padding: '1px'
    },
    noselect()
  ),
  controls: {
    display: 'flex',
    paddingTop: '7px'
  },
  pf: styleElement(0),
  lff: styleElement(1),
  lef: styleElement(2),
  lfe: styleElement(3),
  lee: styleElement(4),
  rfn: styleElement(5),
  rfp: styleElement(6),
  ren: styleElement(7),
  rep: styleElement(8)
};

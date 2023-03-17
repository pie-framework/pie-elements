import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/render-ui';
import Trait from './trait';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const styles = () => ({
  wrapper: {
    display: 'flex',
    position: 'relative'
  },
  tableWrapper: {
    width: '100%',
    overflow: 'scroll'
  },
  table: {
    borderSpacing: 0,
    marginBottom: '16px',
    borderRadius: '4px',
    color: color.text(),
    fontSize: '14px',
    lineHeight: '16px',
    overflow: 'unset',

    '& ul, ol': {
      marginBlockStart: 0,
      paddingInlineStart: '16px',
    },

    '& th': {
      padding: '16px',
      textAlign: 'left',
      backgroundColor: color.secondaryBackground(),
      verticalAlign: 'bottom',
    },

    '& th div': {
      width: '200px',
    },

    '& td': {
      width: '200px',
      padding: '16px 8px',
      verticalAlign: 'top',
    },
  },
  scorePointHeader: {
    '& td': {
      border: 0,
      padding: 0,
      textAlign: 'center',
      minWidth: '200px',
    },
  },
  pointLabel: {
    marginBottom: '4px',
  },
  scorePointValue: {
    fontWeight: 'normal',
  },
});

const ArrowContainer = ({ show, onClick, extraStyles, children }) => (
  <div
    style={{
      height: 'calc(100% - 1px)',
      top: '1px',
      display: show ? 'flex' : 'none',
      width: '50px',
      margin: 'auto',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      ...extraStyles
    }}
    onClick={onClick}
  >
    {children}
  </div>
);

ArrowContainer.propTypes = {
  show: PropTypes.bool,
  onClick: PropTypes.func,
  extraStyles: PropTypes.object,
  children: PropTypes.object,
};


class Scale extends React.Component {
  state = {};

  // constructor() {
  //   super();
  //   document.querySelector('body > catalog-container > catalog-entry > catalog-demo > div:nth-child(2)').style.width = '800px';
  // }

  componentDidMount() {
    if (this.tableWrapper) {
      if (this.tableWrapper.offsetWidth < this.tableWrapper.scrollWidth) {
        this.setState({ showRight: true });
      }
    }
  }

  scrollLeft = () => {
    this.tableWrapper.scrollLeft -= this.tableWrapper.offsetWidth / 2;

    this.setState({
      showRight: this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth,
      showLeft: this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth && this.tableWrapper.scrollLeft > 0,
    });
  }

  scrollRight = () => {
    const initialScrollLeft = this.tableWrapper.scrollLeft;
    this.tableWrapper.scrollLeft += this.tableWrapper.offsetWidth / 2;

    this.setState({
      showRight: initialScrollLeft !== this.tableWrapper.scrollLeft && this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth,
      showLeft: this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth && this.tableWrapper.scrollLeft > 0,
    });
  }

  render() {
    const { showRight, showLeft } = this.state;
    const { classes, scale, scaleIndex, showDescription, showPointsLabels, showStandards } = this.props;
    const { excludeZero, maxPoints, traitLabel, traits, scorePointsLabels } = scale || {};

    let scorePointsValues = [];
    let descriptions;
    let pointsLabels;
    let standards;

    try {
      // determining the score points values
      for (let pointValue = maxPoints; pointValue >= excludeZero ? 1 : 0; pointValue -= 1) {
        scorePointsValues.push(pointValue);
      }

      const { traitStandards, traitDescriptions } = traits.reduce(
        (tcc, trait) => ({
          traitStandards: [...tcc.traitStandards, ...(trait.standards || [])],
          traitDescriptions: [...tcc.traitDescriptions, ...(trait.description || [])],
        }),
        {
          traitStandards: [],
          traitDescriptions: [],
        },
      );

      descriptions = showDescription && traitDescriptions.length;
      pointsLabels = showPointsLabels && scorePointsLabels.length;
      standards = showStandards && traitStandards.length;
    } catch (e) {
      descriptions = false;
      pointsLabels = false;
      standards = false;
    }

    return (
      <div className={classes.wrapper}>

        <ArrowContainer
          show={showLeft}
          onClick={this.scrollLeft}
          extraStyles={{
            left: 0,
            background: `linear-gradient(to right, white, ${color.background()})`,
          }}
        >
          <ArrowBackIosIcon/>
        </ArrowContainer>

        <div
          className={classes.tableWrapper}
          ref={ref => {
            this.tableWrapper = ref;
          }}
          onScroll={() => {
            this.setState({
              // 5 is a margin of error
              showRight: this.tableWrapper.scrollLeft + this.tableWrapper.offsetWidth < this.tableWrapper.scrollWidth - 5
                && this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth,
              showLeft: this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth && this.tableWrapper.scrollLeft > 0,
            });
          }}
        >
          <table
            key={`scale-${scaleIndex}`}
            className={classes.table}
          >
            <thead>
            <tr>
              <th>
                <div dangerouslySetInnerHTML={{ __html: traitLabel }}/>
              </th>

              {standards ? (
                <th>
                  <div>Standard(s)</div>
                </th>
              ) : null}

              {descriptions ? (
                <th>
                  <div>Description</div>
                </th>
              ) : null}

              {scorePointsValues &&
                scorePointsValues.map((scorePointValue, index) => {
                  let pointLabel = '';

                  // to handle the case when there aren't enough labels
                  try {
                    pointLabel = scorePointsLabels[scorePointsValues.length - index - 1] || '';
                  } catch (e) {
                    pointLabel = '';
                  }

                  return (
                    <th key={`table-header-${index}`}>
                      <table className={classes.scorePointHeader}>
                        <thead>
                        {pointsLabels ? (
                          <tr>
                            <td>
                              <div className={classes.pointLabel} dangerouslySetInnerHTML={{ __html: pointLabel }}/>
                            </td>
                          </tr>
                        ) : null}
                        <tr>
                          <td className={classes.scorePointValue}>
                            {scorePointValue === 1 ? `${scorePointValue} point` : `${scorePointValue} points`}
                          </td>
                        </tr>
                        </thead>
                      </table>
                    </th>
                  );
                })}
            </tr>
            </thead>

            <tbody>
            {traits &&
              traits.map((trait, traitIndex) => (
                <Trait
                  key={`trait_${scaleIndex}_${traitIndex}`}
                  trait={trait}
                  traitIndex={traitIndex}
                  showDescription={!!descriptions}
                  showStandards={!!standards}
                  scaleIndex={scaleIndex}
                  scorePointsValues={scorePointsValues}
                  excludeZero={excludeZero}
                />
              ))}
            </tbody>
          </table>
        </div>

        <ArrowContainer
          show={showRight}
          onClick={this.scrollRight}
          extraStyles={{
            right: 0,
            background: `linear-gradient(to left, white, ${color.background()})`,
          }}
        >
          <ArrowForwardIosIcon/>
        </ArrowContainer>
      </div>
    );
  }
}

Scale.propTypes = {
  classes: PropTypes.object,
  scaleIndex: PropTypes.number,
  scale: PropTypes.shape({
    excludeZero: PropTypes.bool,
    maxPoints: PropTypes.number,
    scorePointsLabels: PropTypes.arrayOf(PropTypes.string),
    traitLabel: PropTypes.string,
    traits: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        standards: PropTypes.arrayOf(PropTypes.string),
        scorePointsDescriptors: PropTypes.arrayOf(PropTypes.string),
        description: PropTypes.string,
      }),
    ),
  }),
  showPointsLabels: PropTypes.bool,
  showDescription: PropTypes.bool,
  showStandards: PropTypes.bool,
};

export default withStyles(styles)(Scale);

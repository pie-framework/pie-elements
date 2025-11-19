import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';
import Trait from './trait';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Wrapper = styled('div')({
  display: 'flex',
  position: 'relative',
});

const TableWrapper = styled('div')({
  width: '100%',
  overflow: 'auto',
});

const Table = styled('table')(({ theme }) => ({
  borderSpacing: 0,
  marginBottom: theme.spacing(2),
  borderRadius: '4px',
  color: color.text(),
  fontSize: theme.typography.fontSize,
  lineHeight: '16px',
  overflow: 'unset',

  '& ul, ol': {
    marginBlockStart: 0,
    paddingInlineStart: theme.spacing(2),
  },

  '& th': {
    padding: theme.spacing(2),
    textAlign: 'left',
    backgroundColor: color.secondaryBackground(),
    verticalAlign: 'bottom',
  },

  '& th div': {
    width: '200px',
  },

  '& td': {
    width: '200px',
    padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
    verticalAlign: 'top',
  },
}));

const ScorePointHeaderTable = styled('table')({
  '& td': {
    border: 0,
    padding: 0,
    textAlign: 'center',
    minWidth: '200px',
  },
});

const PointLabel = styled('div')({
  marginBottom: '4px',
});

const ScorePointValue = styled('td')({
  fontWeight: 'normal',
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
      cursor: 'pointer',
      ...extraStyles,
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
  };

  scrollRight = () => {
    const initialScrollLeft = this.tableWrapper.scrollLeft;
    this.tableWrapper.scrollLeft += this.tableWrapper.offsetWidth / 2;

    this.setState({
      showRight:
        initialScrollLeft !== this.tableWrapper.scrollLeft &&
        this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth,
      showLeft: this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth && this.tableWrapper.scrollLeft > 0,
    });
  };

  render() {
    const { showRight, showLeft } = this.state;
    const { scale, scaleIndex, showDescription, showPointsLabels, showStandards, arrowsDisabled } = this.props;
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
      <Wrapper>
        <ArrowContainer
          show={showLeft && !arrowsDisabled}
          onClick={this.scrollLeft}
          extraStyles={{
            left: 0,
            background: `linear-gradient(to right, white, ${color.background()})`,
          }}
        >
          <ArrowBackIosIcon />
        </ArrowContainer>

        <TableWrapper
          ref={(ref) => {
            this.tableWrapper = ref;
          }}
          onScroll={() => {
            this.setState({
              // 5 is a margin of error
              showRight:
                this.tableWrapper.scrollLeft + this.tableWrapper.offsetWidth < this.tableWrapper.scrollWidth - 5 &&
                this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth,
              showLeft:
                this.tableWrapper.scrollLeft < this.tableWrapper.scrollWidth && this.tableWrapper.scrollLeft > 0,
            });
          }}
        >
          {arrowsDisabled && (showRight || showLeft) ? <div>The item is too large to fit in print mode.</div> : null}
          <Table key={`scale-${scaleIndex}`}>
            <thead>
              <tr>
                <th>
                  <div dangerouslySetInnerHTML={{ __html: traitLabel }} />
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
                        <ScorePointHeaderTable>
                          <thead>
                            {pointsLabels ? (
                              <tr>
                                <td>
                                  <PointLabel
                                    dangerouslySetInnerHTML={{ __html: pointLabel }}
                                  />
                                </td>
                              </tr>
                            ) : null}
                            <tr>
                              <ScorePointValue>
                                {scorePointValue === 1 ? `${scorePointValue} point` : `${scorePointValue} points`}
                              </ScorePointValue>
                            </tr>
                          </thead>
                        </ScorePointHeaderTable>
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
          </Table>
        </TableWrapper>

        <ArrowContainer
          show={showRight && !arrowsDisabled}
          onClick={this.scrollRight}
          extraStyles={{
            right: 0,
            background: `linear-gradient(to left, white, ${color.background()})`,
          }}
        >
          <ArrowForwardIosIcon />
        </ArrowContainer>
      </Wrapper>
    );
  }
}

Scale.propTypes = {
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
  arrowsDisabled: PropTypes.bool,
};

export default Scale;

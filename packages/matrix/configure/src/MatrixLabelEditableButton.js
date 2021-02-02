import React, {useState} from 'react';
import styled from 'styled-components';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

import NumberInput from './NumberInput';
import isNumeric from './isNumeric';

const MatrixEditableButtonWrapper = styled.div`
  width: 100%;
  height: 50px;
  margin: 1px;
  background: #04b26e;
  border-radius: 5px;
  color: white;
  font-size: 14px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MatrixEditableButtonContent = styled.div`
  padding: 0 5px 0 12px;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const MatrixEditableButtonText = styled.p`
  margin: 0;
  padding: 3px 0 3px 4px;
  cursor: pointer;
  width: 100%;
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  :hover {
    background: #00985d;
  }
  
  transition: all 0.1s ease-in-out;
`;

const MatrixEditableButtonActions = styled.div`
  padding: 0 3px;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-left: 3px solid #00985d;
  :hover {
    background: #00985d;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  transition: all 0.1s ease-in-out;
`;

const IconWrapper = styled.div`
  font-size: 18px;
`;

const InputWrapper = styled.input`
  margin: 0;
  padding: 0 0 0 4px;
  font-size: 14px;
  border: none;
  outline: none;
  color: white;
  width: 50px;
  width: 100%;
  background: #00985d;
  height: 22px;
  display: flex;
  align-items: center;
`;

const SetScoresToWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SetScoresToInputWrapper = styled.div`
  width: 50px;
  margin-left: 10px;
`;

export const ACTION_TYPE = {
  clear: 'clear',
  sortAscending: 'sortAscending',
  sortDescending: 'sortDescending',
  set: 'set',
};

const MatrixLabelEditableButton = (props) => {
  const { onLabelUpdate, value, resourceIndex, onAction } = props;
  const [labelValue, setLabelValue] = useState(null);
  const [scoreValue, setScoreValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [scoresToRef, setScoresToRef] = React.useState(React.createRef());

  const open = Boolean(anchorEl);

  const onActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    setScoreValue('');
  };

  const onClearScores = (e) => {
    handleClose(e);
    onAction({ resourceIndex, actionType: ACTION_TYPE.clear });
  };

  const onSetScoresAscending = (e) => {
    handleClose(e);
    onAction({ resourceIndex, actionType: ACTION_TYPE.sortAscending });
  };

  const onSetScoresDescending = (e) => {
    handleClose(e);
    onAction({ resourceIndex, actionType: ACTION_TYPE.sortDescending });
  };

  const onSetScores = (value) => {
    if (!isNumeric(value)) {
      setScoreValue('');
      return;
    }
    const scoreValueNew = parseInt(value, 10);
    setScoreValue(scoreValueNew);
    onAction({ resourceIndex, actionType: ACTION_TYPE.set, setValue: scoreValueNew });
  };

  const onBlur = () => {
    const labeValueTrimmed = labelValue.trim();
    if (labeValueTrimmed) {
      onLabelUpdate(labeValueTrimmed);
    }
    setLabelValue(null);
    setShowInput(false);
  };

  const onShowInput = () => {
    setShowInput(true);
    setLabelValue(value);
  };

  const onSetScoreToFocus = () => {
    scoresToRef.current.focus();
  };

  return (
    <MatrixEditableButtonWrapper>
      <MatrixEditableButtonContent>
        {showInput
          ? (
            <InputWrapper
              autoFocus
              value={labelValue}
              onChange={e => setLabelValue(e.target.value)}
              onBlur={onBlur}
            />
          )
          : (
            <MatrixEditableButtonText onClick={onShowInput}>
              {value}
            </MatrixEditableButtonText>
          )
        }

      </MatrixEditableButtonContent>
      <MatrixEditableButtonActions onClick={onActionClick}>
        <IconWrapper>
          <KeyboardArrowDownIcon fontSize='inherit'/>
        </IconWrapper>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem key='item1' selected={false} onClick={onClearScores}>
            Clear Scores
          </MenuItem>
          <MenuItem key='item2' selected={false} onClick={onSetScoresAscending}>
            Set Scores Ascending
          </MenuItem>
          <MenuItem key='item3' selected={false} onClick={onSetScoresDescending}>
            Set Scores Descending
          </MenuItem>
          <MenuItem key='item4' selected={false}>
            <SetScoresToWrapper>
              <p onClick={onSetScoreToFocus}>
                Set Scores To
              </p>
              <SetScoresToInputWrapper>
                <NumberInput
                  onFieldUpdate={onSetScores}
                  name={'setScoreTo'}
                  placeholder='#'
                  fieldValue={{
                    value: scoreValue,
                    ref: scoresToRef
                  }}
                />
              </SetScoresToInputWrapper>
            </SetScoresToWrapper>
          </MenuItem>
        </Menu>
      </MatrixEditableButtonActions>
    </MatrixEditableButtonWrapper>
  )
};

MatrixLabelEditableButton.propTypes = {
  value: PropTypes.string.isRequired,
  resourceIndex: PropTypes.number.isRequired,
  onLabelUpdate: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
};


export default MatrixLabelEditableButton;

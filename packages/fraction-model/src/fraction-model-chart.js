import React, { useState, useEffect, useRef } from 'react';
import { Bar, BarChart, Cell, LabelList, Pie, PieChart, YAxis } from 'recharts';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  pieChartParentDiv: {
    display: 'grid',
    gridTemplateColumns: '200px 200px 200px',
    gap: '10px',
    padding: '5px 0',
  },
  barChartParentDiv: {
    display: 'grid',
    gridTemplateColumns: '200px 200px 200px',
    gap: '20px',
    padding: '10px 0',
  },
  sectorOutline: {
    outline: 'none',
  },
});

const FractionModelChart = (props) => {
  /*
   * Function to handle click event on chart
   * @param chartIndex: index of the chart
   * @param sectorIndex: index of the sector
   * */
  const handleChartClick = (chartIndex, sectorIndex) => {
    if (typeof sectorIndex === 'string') {
      sectorIndex = parseInt(sectorIndex);
    }
    const existingIndex = clickedIndexArray.findIndex((item) => item.id === chartIndex);
    let newClickedIndexArray;
    if (existingIndex >= 0) {
      const currentItem = clickedIndexArray[existingIndex];
      if (currentItem.value === sectorIndex) {
        newClickedIndexArray = clickedIndexArray.filter((_, index) => index !== existingIndex);
      } else {
        newClickedIndexArray = [
          ...clickedIndexArray.slice(0, existingIndex),
          { id: chartIndex, value: sectorIndex },
          ...clickedIndexArray.slice(existingIndex + 1),
        ];
      }
    } else {
      newClickedIndexArray = [...clickedIndexArray, { id: chartIndex, value: sectorIndex }];
    }
    onChange(newClickedIndexArray);
    setClickedIndexArray(newClickedIndexArray);
  };

  /*
   * Function to handle mouse enter event on chart
   * @param chartIndex: index of the chart
   * @param sectorIndex: index of the sector
   * */
  const handleChartMouseEnter = (chartIndex, sectorIndex) => {
    setHoveredIndex(chartIndex + '-' + sectorIndex);
  };

  /*
   * Function to handle mouse leave event on chart
   * @param chartIndex: index of the chart
   * @param sectorIndex: index of the sector
   * */
  const handleChartMouseLeave = (chartIndex, sectorIndex) => {
    setHoveredIndex(null);
  };

  /*
   * Function to get fill color for sector
   * @param hoveredIndex: hovered index
   * @param selection: selected index
   * */
  const getSectorFill = (hoveredIndex, selection) => {
    const [selectionId, selectionValue] = selection.split('-').map(Number);
    // Check for a matching clicked item
    const clickedItem = clickedIndexArray.find((item) => item.id === selectionId);
    if (clickedItem && selectionValue <= clickedItem.value) {
      return 'rgb(60, 73, 150, 0.6)';
    }
    // Check for a matching hovered index
    if (hoveredIndex) {
      const [hoveredId, hoveredValue] = hoveredIndex.split('-').map(Number);
      if (hoveredId === selectionId && hoveredValue >= selectionValue) {
        return 'rgb(0, 0, 0, 0.25)';
      }
    }
    return '#FFFFFF';
  };

  /*
   * Function to render label for pie chart
   * @param props: properties of the label
   * */
  const renderCustomizedLabelForPie = (props) => {
    const { cx, cy, midAngle, outerRadius, index } = props;
    const RADIAN = Math.PI / 180;
    // const radius = outerRadius * 0.5;  //If you want to show label inside the pie
    const radius = outerRadius * 1.13;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#000000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(index + 1).toFixed(0)}`}
      </text>
    );
  };

  /*
   * Function to create and return component for bar chart
   * */
  const barWithBorder = () => {
    return (props) => {
      const { fill, x, y, width, height } = props;
      return (
        <g>
          <rect x={x} y={y} width={width} height={height} stroke={'#000000'} fill={fill} />
        </g>
      );
    };
  };

  const {
    classes,
    value = [],
    modelType = 'bar',
    noOfModels = 0,
    partsPerModel = 0,
    showLabel = false,
    disabled = false,
    onChange,
  } = props;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [clickedIndexArray, setClickedIndexArray] = useState(value);

  /*
   * Function to create and return bar fraction model
   * */
  const getBarFractionModel = () => {
    const parentData = [];
    // Generate data for bar chart
    for (let i = 1; i < noOfModels + 1; i++) {
      const data = [{ name: i }];
      for (let j = 1; j < partsPerModel + 1; j++) {
        data[0][`${j}`] = 1;
      }
      parentData.push(data);
    }
    let barItems = [];
    parentData.forEach((data, chartIndex) => {
      barItems.push(
        <BarChart width={200} height={30 * partsPerModel} data={data} key={`bar-chart-${chartIndex + 1}`}>
          <YAxis hide={true} type="number" domain={[0, partsPerModel]} />
          {Object.keys(data[0]).map((key, index) => {
            if (key !== 'name') {
              return (
                <Bar
                  dataKey={key}
                  stackId="a"
                  key={`bar-${chartIndex + 1}-${index + 1}`}
                  onClick={disabled ? null : () => handleChartClick(chartIndex + 1, key)}
                  onMouseEnter={disabled ? null : () => handleChartMouseEnter(chartIndex + 1, key)}
                  onMouseLeave={disabled ? null : () => handleChartMouseLeave(chartIndex + 1, key)}
                  shape={barWithBorder()}
                  isAnimationActive={false}
                  fill={getSectorFill(hoveredIndex, `${chartIndex + 1}-${key}`)}
                >
                  {showLabel && <LabelList position="left" fill="#000000" />}
                </Bar>
              );
            }
          })}
        </BarChart>,
      );
    });
    return <div className={classes.barChartParentDiv}>{barItems}</div>;
  };

  const pieChartRef = useRef(null);
  
  /*
   * Function to create and return pie fraction model
   * */
  const getPieFractionModel = () => {
    const parentData = [];
    // Generate data for pie chart
    for (let i = 1; i < noOfModels + 1; i++) {
      const data = Array.from({ length: partsPerModel }, (_, index) => ({
        name: `${index + 1}`,
        value: 1,
      }));
      parentData.push(data);
    }
    let pieItems = [];
    parentData.forEach((data, chartIndex) => {
      pieItems.push(
        <PieChart width={200} height={200} key={`pie-chart-${chartIndex}`}>
          <Pie
            data={data}
            key={`pie-${chartIndex + 1}`}
            fill="#FFFFFF"
            stroke="#000000"
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
            labelLine={false}
            label={showLabel && renderCustomizedLabelForPie}
          >
            {data.map((entry, sectorIndex) => (
              <Cell
                className={classes.sectorOutline}
                key={`${chartIndex + 1}-${sectorIndex + 1}`}
                onClick={disabled ? null : () => handleChartClick(chartIndex + 1, sectorIndex + 1)}
                onMouseEnter={disabled ? null : () => handleChartMouseEnter(chartIndex + 1, sectorIndex + 1)}
                onMouseLeave={disabled ? null : () => handleChartMouseLeave(chartIndex + 1, sectorIndex + 1)}
                fill={getSectorFill(hoveredIndex, `${chartIndex + 1}-${sectorIndex + 1}`)}
              />
            ))}
          </Pie>
        </PieChart>,
      );
    });
    return <div ref={pieChartRef} className={classes.pieChartParentDiv}>{pieItems}</div>;
  };

  //Render bar or pie models as per model type
  if (modelType === 'bar') {
    return getBarFractionModel();
  } else if (modelType === 'pie') {
    //Remove the last sector line of pie chart if parts per model is 1
    useEffect(() => {
      if (pieChartRef?.current && partsPerModel === 1){
        const paths = pieChartRef.current.querySelectorAll('path');
        if (paths.length > 0) {
          paths.forEach((path) => {
            let d = path.getAttribute('d');
            path.setAttribute('d', d.replaceAll('L 100,100', ''));
          });
        }
      }
    }, []);
    return getPieFractionModel();
  }
};

export default withStyles(styles)(FractionModelChart);

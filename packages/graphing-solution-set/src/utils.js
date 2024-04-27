/*
 * Check if a line is complete
 * @param {Object} item - mark object
 * */
const completeFromTo = (item) => item && completeMark.point(item.from) && completeMark.point(item.to);

/*
 * Check if a point is correct and complete
 * @param {Object} point - point object
 * */
const completePoint = (point) => point && Number.isFinite(point.x) && Number.isFinite(point.y);

/*
 * Complete mark object for line and point
 * */
const completeMark = {
  line: completeFromTo,
  point: completePoint,
};

//////////////////////////////////////////////////////////////////////////////////
// BELOW FUNCTIONS ARE USED IN configure/src/utils as well
//////////////////////////////////////////////////////////////////////////////////

/*
 * Function to calculate the distance between two points
 * @param {Object} a - point a
 * @param {Object} b - point b
 * */
const distance = (a, b) => {
  return Number(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2).toFixed(3));
};

/*
 * Function to check if a point lies on edges of a polygon
 * @param {Object} point - point object
 * @param {Array} polygon - polygon points array
 * */
const pointInPolygon = (point, polygon) => {
  let c = point;
  let inside = false;
  let clonePolygon = [...polygon];
  clonePolygon.push(polygon[0]);
  for (let i = 0; i < clonePolygon.length - 1; i++) {
    let a = clonePolygon[i];
    let b = clonePolygon[i + 1];
    // check if point is on the edge
    if (distance(a, c) + distance(c, b) === distance(a, b)) {
      inside = true;
      break;
    }
  }
  return inside;
};

/*
 * Function to get the intersection point of two lines
 * @param {Number} x1 - x coordinate of point 1 of line 1
 * @param {Number} y1 - y coordinate of point 1 of line 1
 * @param {Number} x2 - x coordinate of point 2 of line 1
 * @param {Number} y2 - y coordinate of point 2 of line 1
 * @param {Number} x3 - x coordinate of point 1 of line 2
 * @param {Number} y3 - y coordinate of point 1 of line 2
 * @param {Number} x4 - x coordinate of point 2 of line 2
 * @param {Number} y4 - y coordinate of point 2 of line 2
 * */
const lineIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  let ua,
    denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denominator === 0) {
    return null;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  return {
    x: Number((x1 + ua * (x2 - x1)).toFixed(3)),
    y: Number((y1 + ua * (y2 - y1)).toFixed(3)),
  };
};

/*
 * Check if a point is inside the graph
 * @param {Object} point - point object
 * @param {Object} domain - domain object
 * @param {Object} range - range object
 * */
const isPointInsideGraph = (point, domain, range) => {
  return point.x > domain.min && point.x < domain.max && point.y > range.min && point.y < range.max;
};

/*
 * Check if a point is on or inside the graph
 * @param {Object} point - point object
 * @param {Object} domain - domain object
 * @param {Object} range - range object
 * */
const isPointOnOrInsideGraph = (point, domain, range) => {
  return point.x >= domain.min && point.x <= domain.max && point.y >= range.min && point.y <= range.max;
};

/*
 * Find the intersection point of a mark with the graph
 * @param {Object} mark - mark object
 * @param {Object} domain - domain object
 * @param {Object} range - range object
 * */
const findIntersectionPointForMark = (mark, domain, range) => {
  let intersectionPoint = [];
  let tempData = [
    [domain.max, range.max, domain.max, range.min],
    [domain.min, range.max, domain.min, range.min],
    [domain.min, range.max, domain.max, range.max],
    [domain.min, range.min, domain.max, range.min],
  ];
  for (let i = 0; i < tempData.length; i++) {
    let intersection = lineIntersect(
      mark.from.x,
      mark.from.y,
      mark.to.x,
      mark.to.y,
      tempData[i][0],
      tempData[i][1],
      tempData[i][2],
      tempData[i][3],
    );
    if (intersection && isPointOnOrInsideGraph(intersection, domain, range)) {
      intersectionPoint.push(intersection);
    }
  }
  return intersectionPoint;
};

/*
 * Sort points in clockwise direction for a polygon
 * @param {Array} points - points array
 * */
const sortPointsClockWise = (points) => {
  // Find min max to get center and Sort from top to bottom
  points.sort((a, b) => a.y - b.y);
  // Get center y
  const cy = (points[0].y + points[points.length - 1].y) / 2;
  // Sort from right to left
  points.sort((a, b) => b.x - a.x);
  // Get center x
  const cx = (points[0].x + points[points.length - 1].x) / 2;
  // Center point
  const center = { x: cx, y: cy };
  // As the points are sorted from right to left the first point is the rightmost Starting angle used to reference other angles
  let startAng;
  points.forEach((point) => {
    let ang = Math.atan2(point.y - center.y, point.x - center.x);
    if (!startAng) {
      startAng = ang;
    } else {
      if (ang < startAng) {
        // ensure that all points are clockwise of the start point
        ang += Math.PI * 2;
      }
    }
    point.angle = ang; // add the angle to the point
  });
  // first sort clockwise
  points.sort((a, b) => a.angle - b.angle);
  // then reverse the order
  const ccwPoints = points.reverse();
  // move the last point back to the start
  ccwPoints.unshift(ccwPoints.pop());
  return ccwPoints.map(({ angle, ...attr }) => attr);
};

/*
 * Function to calculate the dot product of two vectors
 * @param {Object} v1 - point 1
 * @param {Object} v2 - point 2
 * */
const dotProduct = (v1, v2) => {
  return v1.x * v2.x + v1.y * v2.y;
};

/*
 * Function to calculate the magnitude of a vector
 * @param {Object} v - point object
 * */
const magnitude = (v) => {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

/*
 * Function to calculate the angle between two vectors in radians
 * @param {Object} v1 - point 1
 * @param {Object} v2 - point 2
 * */
const angleBetweenVectors = (v1, v2) => {
  const dot = dotProduct(v1, v2);
  const magV1 = magnitude(v1);
  const magV2 = magnitude(v2);
  // Ensure the dot product is within the domain of the acos function
  return Math.acos(dot / (magV1 * magV2));
};

/*
 * Function to check if a point lies between the angle formed by two lines
 * @param {Object} commonPoint - common point of the two lines
 * @param {Object} point1 - point 1 of cone
 * @param {Object} point2 - point 2 of cone
 * @param {Object} testPoint - point to be tested
 * */
const pointInAngle = (commonPoint, point1, point2, testPoint) => {
  const vector1 = { x: point1.x - commonPoint.x, y: point1.y - commonPoint.y };
  const vector2 = { x: point2.x - commonPoint.x, y: point2.y - commonPoint.y };
  const testVector = { x: testPoint.x - commonPoint.x, y: testPoint.y - commonPoint.y };
  const angle1 = angleBetweenVectors(vector1, testVector);
  const angle2 = angleBetweenVectors(vector2, testVector);
  const angleSum = angle1 + angle2;
  // Check if the sum of angles is approximately equal to the angle between the two lines
  // You may need to adjust the tolerance (e.g., 0.0001) based on your specific requirements
  const tolerance = 0.0001;
  return Math.abs(angleSum - angleBetweenVectors(vector1, vector2)) < tolerance;
};

/*
 * Function to remove duplicate points from an array
 * @param {Array} array - array of points
 * */
const removeDuplicatesFromArray = (array) => {
  return array.filter((obj, index) => {
    return index === array.findIndex((o) => obj.x === o.x && obj.y === o.y);
  });
};

/*
 * Function to remove duplicate points and filter sections
 * @param {Array} sections - array of sections
 * */
const removeDuplicateAndFilterSections = (sections) => {
  //removing duplicate points.
  for (let i = 0; i < sections.length; i++) {
    sections[i] = sections[i].filter((obj, index) => {
      return index === sections[i].findIndex((o) => obj.x === o.x && obj.y === o.y);
    });
  }
  //removing arrays with two points
  sections = sections.filter((section) => section.length > 2);
  //sorting the points in clockwise direction
  for (let i = 0; i < sections.length; i++) {
    sections[i] = sortPointsClockWise(sections[i]);
  }
  return sections;
};

/*
 * Function to find sections in solution set for one line
 * @param {Array} intersectionPoint - intersection point
 * @param {Object} domain - domain object
 * @param {Object} range - range object
 * */
const findSectionsInSolutionSetForOneLine = (intersectionPoint, domain, range) => {
  let sections = [];
  sections.push([].concat(intersectionPoint));
  sections.push([].concat(intersectionPoint));
  if (
    (intersectionPoint[0].x === domain.max && intersectionPoint[1].y === range.max) ||
    (intersectionPoint[1].x === domain.max && intersectionPoint[0].y === range.max)
  ) {
    sections[0].push({ x: domain.max, y: range.max });
    sections[1].push({ x: domain.min, y: range.max }, { x: domain.min, y: range.min }, { x: domain.max, y: range.min });
  } else if (
    (intersectionPoint[0].x === domain.min && intersectionPoint[1].y === range.max) ||
    (intersectionPoint[1].x === domain.min && intersectionPoint[0].y === range.max)
  ) {
    sections[0].push({ x: domain.min, y: range.max });
    sections[1].push({ x: domain.max, y: range.max }, { x: domain.max, y: range.min }, { x: domain.min, y: range.min });
  } else if (
    (intersectionPoint[0].x === domain.min && intersectionPoint[1].y === range.min) ||
    (intersectionPoint[1].x === domain.min && intersectionPoint[0].y === range.min)
  ) {
    sections[0].push({ x: domain.min, y: range.min });
    sections[1].push({ x: domain.max, y: range.min }, { x: domain.max, y: range.max }, { x: domain.min, y: range.max });
  } else if (
    (intersectionPoint[0].x === domain.max && intersectionPoint[1].y === range.min) ||
    (intersectionPoint[1].x === domain.max && intersectionPoint[0].y === range.min)
  ) {
    sections[0].push({ x: domain.max, y: range.min });
    sections[1].push({ x: domain.min, y: range.min }, { x: domain.min, y: range.max }, { x: domain.max, y: range.max });
  } else if (
    (intersectionPoint[0].x === domain.min && intersectionPoint[1].x === domain.max) ||
    (intersectionPoint[0].x === domain.max && intersectionPoint[1].x === domain.min)
  ) {
    sections[0].push({ x: domain.min, y: range.max }, { x: domain.max, y: range.max });
    sections[1].push({ x: domain.min, y: range.min }, { x: domain.max, y: range.min });
  } else if (
    (intersectionPoint[0].y === range.min && intersectionPoint[1].y === range.max) ||
    (intersectionPoint[0].y === range.max && intersectionPoint[1].y === range.min)
  ) {
    sections[0].push({ x: domain.min, y: range.min }, { x: domain.min, y: range.max });
    sections[1].push({ x: domain.max, y: range.min }, { x: domain.max, y: range.max });
  }
  return removeDuplicateAndFilterSections(sections);
};

/*
 * Function to find sections in solution set for two lines
 * @param {Object} gssLineData - graphing solution set line data
 * @param {Array} answers - answers array
 * @param {Object} domain - domain object
 * @param {Object} range - range object
 * */
const findSectionsInSolutionSetForTwoLines = (gssLineData, answers, domain, range) => {
  let mark1 = answers[0];
  let mark2 = answers[1];
  let cornerPoints = [
    { x: domain.min, y: range.min },
    { x: domain.min, y: range.max },
    { x: domain.max, y: range.min },
    { x: domain.max, y: range.max },
  ];
  let intersectPoint = lineIntersect(
    mark1.from.x,
    mark1.from.y,
    mark1.to.x,
    mark1.to.y,
    mark2.from.x,
    mark2.from.y,
    mark2.to.x,
    mark2.to.y,
  );
  let sections = [];
  let intersectionPoint1 = findIntersectionPointForMark(mark1, domain, range);
  intersectionPoint1 = removeDuplicatesFromArray(intersectionPoint1);
  let intersectionPoint2 = findIntersectionPointForMark(mark2, domain, range);
  intersectionPoint2 = removeDuplicatesFromArray(intersectionPoint2);
  if (intersectPoint && isPointInsideGraph(intersectPoint, domain, range)) {
    for (let i = 0; i < intersectionPoint1.length; i++) {
      for (let j = 0; j < intersectionPoint2.length; j++) {
        let bucket = [];
        let newCornerPoints = [];
        bucket.push(intersectPoint);
        bucket.push(intersectionPoint1[i]);
        bucket.push(intersectionPoint2[j]);
        for (let k = 0; k < cornerPoints.length; k++) {
          if (pointInAngle(intersectPoint, intersectionPoint1[i], intersectionPoint2[j], cornerPoints[k])) {
            bucket.push(cornerPoints[k]);
          } else {
            newCornerPoints.push(cornerPoints[k]);
          }
        }
        cornerPoints = newCornerPoints;
        sections.push(bucket);
      }
    }
  } else {
    let sections1 = findSectionsInSolutionSetForOneLine(intersectionPoint1, domain, range);
    let sections2 = findSectionsInSolutionSetForOneLine(intersectionPoint2, domain, range);
    for (let i = 0; i < sections1.length; i++) {
      if (
        !(pointInPolygon(intersectionPoint2[0], sections1[i]) && pointInPolygon(intersectionPoint2[1], sections1[i]))
      ) {
        sections.push(sections1[i]);
      }
    }
    for (let i = 0; i < sections2.length; i++) {
      if (
        !(pointInPolygon(intersectionPoint1[0], sections2[i]) && pointInPolygon(intersectionPoint1[1], sections2[i]))
      ) {
        sections.push(sections2[i]);
      }
    }
    for (let i = 0; i < sections.length; i++) {
      cornerPoints = cornerPoints.filter(function (o1) {
        return !sections[i].some(function (o2) {
          return o1.x === o2.x && o1.y === o2.y;
        });
      });
    }
    let sections3 = cornerPoints.concat(intersectionPoint1, intersectionPoint2);
    sections.push(sections3);
  }
  return removeDuplicateAndFilterSections(sections);
};

/*
 * Function to find sections in solution set
 * @param {Object} gssLineData - graphing solution set line data
 * @param {Array} answers - answers array
 * @param {Object} domain - domain object
 * @param {Object} range - range object
 * */
export const findSectionsInSolutionSet = (gssLineData, answers, domain, range) => {
  if (gssLineData.numberOfLines === 1) {
    const intersectionPoint = findIntersectionPointForMark(answers[0], domain, range);
    gssLineData.sections = findSectionsInSolutionSetForOneLine(intersectionPoint, domain, range);
  } else {
    gssLineData.sections = findSectionsInSolutionSetForTwoLines(gssLineData, answers, domain, range);
  }
  return gssLineData;
};

/*
 * Function to check if a point is inside a polygon
 * @param {Object} point - point to be checked
 * @param {Array} polygon - polygon points array
 * */
export const pointInsidePolygon = (point, polygon) => {
  const num_vertices = polygon.length;
  const x = point.x;
  const y = point.y;
  let inside = false;
  let p1 = polygon[0];
  let p2;
  for (let i = 1; i <= num_vertices; i++) {
    p2 = polygon[i % num_vertices];
    if (y > Math.min(p1.y, p2.y)) {
      if (y <= Math.max(p1.y, p2.y)) {
        if (x <= Math.max(p1.x, p2.x)) {
          const x_intersection = ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x;
          if (p1.x === p2.x || x <= x_intersection) {
            inside = !inside;
          }
        }
      }
    }
    p1 = p2;
  }
  return inside;
};

/*
 * Function to check if lines are added in the graph
 * @param {Object} gssLineData - graphing solution set line data
 * @param {Array} answer - answer array
 * */
export const checkIfLinesAreAdded = (gssLineData, answer) => {
  if (answer.length === 0) {
    return false;
  }
  if (gssLineData.numberOfLines === 1) {
    if (answer.length === 1) {
      return !answer[0].building;
    }
  } else {
    if (answer.length !== 2) {
      return false;
    } else {
      return !answer[1].building;
    }
  }
};

/*
 * Function to remove invalid answers
 * @param {Array} answers - answers array
 * */
export const removeInvalidAnswers = (answers) =>
  answers
    ? (answers || []).filter(({ type, ...answer }) => (completeMark[type] ? completeMark[type](answer) : false))
    : [];

import { getPointTimeDuration } from './common.js';

const getColor = () => `hsl(${Math.floor(360 * Math.random())},
 ${Math.floor(50 + 20 * Math.random())}%,
  ${Math.floor(45 + 20 * Math.random())}%)`;

const getLigthenColors = (colors) =>
  colors.map((color) => (
    color.slice(0, -4) + ((+color.slice(-4, -2) + 20)).toString() + color.slice(-2)),
  );

const getPointTypes = (points) => [...new Set(points.map((point) => point.type))];

const getCostByType = (types, points) =>
  types
    .map(
      (type) => points
        .filter(
          (point) => point.type === type)
        .reduce(
          (sum, point) => sum + point.basePrice, 0),
    );

const getCountByType = (types, points) =>
  types
    .map(
      (type) => points
        .filter(
          (point) => point.type === type).length,
    );

const getTravelTimeByType = (types, points) =>
  types
    .map(
      (type) => points
        .filter(
          (point) => point.type === type)
        .reduce((sum, point) => sum + getPointTimeDuration(point), 0),
    );

const sortLabelsByIndex = (labels, data) => {
  const temp = {};

  labels.map((label) => { temp[label] = data[labels.indexOf(label)]; });

  return new Map(Object.entries(temp).sort((a, b) => b[1] - a[1]));
};

export { getColor, getLigthenColors, getPointTypes, getCostByType, getCountByType, getTravelTimeByType, sortLabelsByIndex };

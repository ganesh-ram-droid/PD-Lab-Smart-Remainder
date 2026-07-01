const { round } = require('../utils/learningWeights');
const { buildDailySeries } = require('../utils/chartFormatter');

const calculateRate = (numerator, denominator) => {
  if (!denominator) {
    return 0;
  }

  return round((Number(numerator) / Number(denominator)) * 100);
};

const calculateAverage = (items, selector) => {
  const values = items
    .map(selector)
    .filter((value) => value !== null && value !== undefined && !Number.isNaN(Number(value)))
    .map(Number);

  if (!values.length) {
    return 0;
  }

  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
};

const topValue = (items, selector) => {
  const map = new Map();

  items.forEach((item) => {
    const key = selector(item) || 'Unknown';
    map.set(key, (map.get(key) || 0) + 1);
  });

  let result = null;
  let count = -1;

  map.forEach((value, key) => {
    if (value > count) {
      count = value;
      result = key;
    }
  });

  return result;
};

const buildCountSummary = (items, field, values) => {
  const summary = {};
  values.forEach((value) => {
    summary[value] = items.filter((item) => item[field] === value).length;
  });

  return summary;
};

const buildDailyTrend = (items, options = {}) => buildDailySeries(items, options);

module.exports = {
  calculateRate,
  calculateAverage,
  topValue,
  buildCountSummary,
  buildDailyTrend
};

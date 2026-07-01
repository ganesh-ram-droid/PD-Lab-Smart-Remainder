const toISODate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
};

const buildDailySeries = (items, { dateField = 'createdAt', valueField = null } = {}) => {
  const map = new Map();

  items.forEach((item) => {
    const key = toISODate(item[dateField]);

    if (!key) {
      return;
    }

    const current = map.get(key) || 0;
    map.set(key, current + (valueField ? Number(item[valueField] || 0) : 1));
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
};

const buildTrendSeries = (items, { dateField = 'createdAt', valueField = 'value' } = {}) => {
  return items
    .map((item) => ({
      date: toISODate(item[dateField]),
      value: Number(item[valueField] || 0)
    }))
    .filter((item) => item.date !== null);
};

const buildCategorySeries = (items, keyField = 'category') => {
  const map = new Map();

  items.forEach((item) => {
    const key = item[keyField] || 'Unknown';
    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));
};

const buildChartPayload = ({ title, labels, series }) => ({
  title,
  labels,
  series
});

module.exports = {
  toISODate,
  buildDailySeries,
  buildTrendSeries,
  buildCategorySeries,
  buildChartPayload
};

const { toISODate, buildChartPayload, buildDailySeries, buildTrendSeries, buildCategorySeries } = require('../utils/chartFormatter');

const buildAnalyticsReport = (payload) => {
  const charts = payload.charts || {};

  return {
    generatedAt: new Date().toISOString(),
    range: payload.range,
    dashboard: payload.dashboard,
    reminders: payload.reminders,
    notifications: payload.notifications,
    context: payload.context,
    behavior: payload.behavior,
    location: payload.location,
    charts,
    summary: {
      completionRate: payload.dashboard.completionPercentage,
      contextScore: payload.dashboard.averageContextScore,
      notificationsSent: payload.notifications.notificationsSent,
      remindersTotal: payload.reminders.totalReminders
    }
  };
};

const buildChartsResponse = ({ daily, weekly, monthly, yearly, trends, reminderActivity, notificationTrend, contextScoreHistory }) => ({
  dailyStatistics: buildChartPayload({
    title: 'Daily Statistics',
    labels: daily.map((item) => item.date),
    series: daily
  }),
  weeklyStatistics: buildChartPayload({
    title: 'Weekly Statistics',
    labels: weekly.map((item) => item.date),
    series: weekly
  }),
  monthlyStatistics: buildChartPayload({
    title: 'Monthly Statistics',
    labels: monthly.map((item) => item.date),
    series: monthly
  }),
  yearlyStatistics: buildChartPayload({
    title: 'Yearly Statistics',
    labels: yearly.map((item) => item.date),
    series: yearly
  }),
  trendGraphs: trends,
  contextScoreHistory,
  reminderActivityGraph: reminderActivity,
  notificationTrendGraph: notificationTrend
});

module.exports = {
  buildAnalyticsReport,
  buildChartsResponse
};

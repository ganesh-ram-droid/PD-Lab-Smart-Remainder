import { useAnalyticsStore } from '../store/analyticsStore';

const useAnalytics = () => {
  const store = useAnalyticsStore((state) => state);

  return {
    ...store,
    loadAnalytics: store.loadAnalytics,
    refreshAnalytics: store.refreshAnalytics
  };
};

export default useAnalytics;

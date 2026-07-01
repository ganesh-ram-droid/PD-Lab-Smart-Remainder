import { useContextStore } from '../store/contextStore';

const useContextEvaluation = () => {
  const store = useContextStore((state) => state);

  return {
    ...store,
    evaluateContext: store.evaluateContext,
    refreshContext: store.refreshContext,
    loadHistory: store.loadHistory,
    loadBehaviorProfile: store.loadBehaviorProfile,
    loadDashboardData: store.loadDashboardData
  };
};

export default useContextEvaluation;

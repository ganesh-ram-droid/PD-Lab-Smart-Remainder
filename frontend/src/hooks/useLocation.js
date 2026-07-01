import { useLocationStore } from '../store/locationStore';

const useLocation = () => {
  const store = useLocationStore((state) => state);

  return {
    ...store,
    requestPermission: store.requestPermission,
    watchLocation: store.startTracking,
    stopTracking: store.stopTracking,
    updateLocation: store.fetchCurrentLocation
  };
};

export default useLocation;

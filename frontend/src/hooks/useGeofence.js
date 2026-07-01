import { useLocationStore } from '../store/locationStore';

const useGeofence = () => {
  const store = useLocationStore((state) => state);

  return {
    geofence: store.geofence,
    loading: store.loading,
    error: store.error,
    createGeofence: store.createGeofence,
    updateGeofence: store.updateGeofence,
    deleteGeofence: store.deleteGeofence,
    checkGeofence: store.checkGeofence,
    setGeofence: store.setGeofence
  };
};

export default useGeofence;

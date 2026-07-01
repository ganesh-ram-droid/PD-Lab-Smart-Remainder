import { create } from 'zustand';

import locationService from '../services/locationService';
import geofenceService from '../services/geofenceService';
import reminderService from '../services/reminderService';

const defaultRegion = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05
};

const normalizeLocation = (location) => {
  if (!location) {
    return null;
  }

  return {
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
    accuracy: location.accuracy ?? null,
    speed: location.speed ?? null,
    heading: location.heading ?? null,
    altitude: location.altitude ?? null,
    provider: location.provider || 'device',
    timestamp: location.timestamp || new Date().toISOString(),
    address: location.address || ''
  };
};

const normalizeReminder = (item = {}) => ({
  reminderId: item.reminderId || item.id || '',
  title: item.title || 'Untitled reminder',
  category: item.category || 'Personal',
  priority: item.priority || 'Low',
  status: item.status || 'Pending',
  reminderDate: item.reminderDate || '',
  reminderTime: item.reminderTime || '',
  latitude: item.latitude ?? null,
  longitude: item.longitude ?? null,
  radius: item.radius ?? 0,
  description: item.description || ''
});

export const useLocationStore = create((set, get) => ({
  currentLocation: null,
  permissionStatus: 'unknown',
  loading: false,
  error: null,
  nearbyReminders: [],
  mapRegion: defaultRegion,
  selectedMarker: null,
  geofence: null,
  mapType: 'standard',
  searchQuery: '',
  searchResults: [],
  watchSubscription: null,

  clearError: () => set({ error: null }),

  setMapType: (mapType) => set({ mapType }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setSelectedMarker: (selectedMarker) => set({ selectedMarker }),

  clearSelectedMarker: () => set({ selectedMarker: null }),

  setGeofence: (geofence) => set({ geofence }),

  requestPermission: async () => {
    set({ loading: true, error: null });

    try {
      const status = await locationService.requestLocationPermission();
      set({
        permissionStatus: status.status,
        loading: false
      });
      return status;
    } catch (error) {
      set({
        permissionStatus: 'denied',
        error: error.message,
        loading: false
      });
      throw error;
    }
  },

  fetchCurrentLocation: async () => {
    set({ loading: true, error: null });

    try {
      const location = normalizeLocation(await locationService.getDeviceLocation());
      if (!location) {
        throw new Error('Unable to determine current location.');
      }

      const region = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      };

      set({
        currentLocation: location,
        mapRegion: region,
        loading: false
      });

      try {
        await locationService.updateLocation(location);
      } catch (updateError) {
        set({ error: updateError.message });
      }

      return location;
    } catch (error) {
      set({
        error: error.message,
        loading: false
      });
      throw error;
    }
  },

  startTracking: async () => {
    const existing = get().watchSubscription;

    if (existing) {
      return existing;
    }

    const subscription = await locationService.watchDeviceLocation(async (position) => {
      const location = normalizeLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        heading: position.coords.heading,
        altitude: position.coords.altitude,
        provider: 'watch',
        timestamp: new Date(position.timestamp).toISOString()
      });

      set((state) => ({
        currentLocation: location,
        mapRegion: {
          ...state.mapRegion,
          latitude: location.latitude,
          longitude: location.longitude
        }
      }));

      try {
        await locationService.updateLocation(location);
      } catch (error) {
        set({ error: error.message });
      }
    });

    set({ watchSubscription: subscription });
    return subscription;
  },

  stopTracking: () => {
    const subscription = get().watchSubscription;

    if (subscription?.remove) {
      subscription.remove();
    }

    set({ watchSubscription: null });
  },

  searchLocations: async (query) => {
    set({ loading: true, error: null, searchQuery: query });

    try {
      const results = await locationService.searchLocations(query);
      set({ searchResults: results, loading: false });
      return results;
    } catch (error) {
      set({
        searchResults: [],
        error: error.message,
        loading: false
      });
      throw error;
    }
  },

  moveMapTo: (latitude, longitude) => {
    set({
      mapRegion: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      }
    });
  },

  loadNearbyReminders: async () => {
    set({ loading: true, error: null });

    try {
      const response = await reminderService.getReminders({ limit: 100 });
      const reminders = Array.isArray(response)
        ? response
        : response.reminders || response.items || response.data || [];
      const currentLocation = get().currentLocation;

      const normalized = reminders
        .map(normalizeReminder)
        .filter((item) => item.latitude != null && item.longitude != null);

      const nearbyReminders = normalized
        .map((item) => {
          const distance = currentLocation
            ? geofenceService.calculateDistanceMeters(currentLocation, {
                latitude: item.latitude,
                longitude: item.longitude
              })
            : null;

          return {
            ...item,
            distance
          };
        })
        .sort((a, b) => (a.distance ?? Number.MAX_SAFE_INTEGER) - (b.distance ?? Number.MAX_SAFE_INTEGER));

      set({
        nearbyReminders,
        loading: false
      });

      return nearbyReminders;
    } catch (error) {
      set({
        nearbyReminders: [],
        error: error.message,
        loading: false
      });
      throw error;
    }
  },

  createGeofence: async (payload) => {
    set({ loading: true, error: null });

    try {
      const result = await geofenceService.createGeofence(payload);
      set({ geofence: result.geofence || result, loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateGeofence: async (geofenceId, payload) => {
    set({ loading: true, error: null });

    try {
      const result = await geofenceService.updateGeofence(geofenceId, payload);
      set({ geofence: result.geofence || result, loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteGeofence: async (geofenceId) => {
    set({ loading: true, error: null });

    try {
      const result = await geofenceService.deleteGeofence(geofenceId);
      set({ geofence: null, loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  checkGeofence: async (payload) => {
    set({ loading: true, error: null });

    try {
      const result = await geofenceService.checkGeofence(payload);
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

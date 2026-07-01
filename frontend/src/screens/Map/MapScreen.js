import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../../constants/colors';
import routes from '../../constants/routes';
import useLocation from '../../hooks/useLocation';
import GoogleMapView from '../../components/map/GoogleMapView';
import CurrentLocationButton from '../../components/map/CurrentLocationButton';
import LocationSearchBar from '../../components/map/LocationSearchBar';
import MapLegend from '../../components/map/MapLegend';
import LocationInfoCard from '../../components/map/LocationInfoCard';
import MapBottomSheet from '../../components/map/MapBottomSheet';

const mapTypes = [
  { label: 'Normal', value: 'standard' },
  { label: 'Satellite', value: 'satellite' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Terrain', value: 'terrain' }
];

const MapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const {
    currentLocation,
    permissionStatus,
    loading,
    error,
    mapRegion,
    mapType,
    searchQuery,
    searchResults,
    selectedMarker,
    nearbyReminders,
    geofence,
    setSearchQuery,
    requestPermission,
    watchLocation,
    updateLocation,
    stopTracking,
    searchLocations,
    setMapType,
    setSelectedMarker,
    moveMapTo,
    loadNearbyReminders,
    clearError,
    fetchCurrentLocation
  } = useLocation();

  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let subscription;

    const initialize = async () => {
      try {
        await requestPermission();
        await updateLocation();
        subscription = await watchLocation();
        await loadNearbyReminders();
      } catch (mapError) {
        Alert.alert('Location unavailable', mapError.message);
      }
    };

    initialize();

    return () => {
      stopTracking();
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, [loadNearbyReminders, requestPermission, stopTracking, updateLocation, watchLocation]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setSearching(true);

    try {
      const results = await searchLocations(searchQuery);
      if (results[0]) {
        const first = results[0];
        moveMapTo(first.latitude, first.longitude);
        setSelectedMarker({
          latitude: first.latitude,
          longitude: first.longitude,
          address: first.displayName
        });

        mapRef.current?.animateToRegion(
          {
            latitude: first.latitude,
            longitude: first.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
          },
          650
        );
      }
    } catch (searchError) {
      Alert.alert('Search failed', searchError.message);
    } finally {
      setSearching(false);
    }
  }, [moveMapTo, searchLocations, searchQuery, setSelectedMarker]);

  const handleCurrentLocation = async () => {
    try {
      const location = await fetchCurrentLocation();
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        },
        650
      );
    } catch (currentError) {
      Alert.alert('Unable to access location', currentError.message);
    }
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedMarker({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      address: 'Selected on map'
    });
  };

  const currentDetails = selectedMarker || currentLocation || {};

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <View className="rounded-3xl bg-white px-4 py-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-bold text-slate-950">Map</Text>
              <Text className="mt-1 text-xs text-slate-500">
                {permissionStatus === 'granted' ? 'Live location enabled' : 'Permission required'}
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate(routes.NEARBY_REMINDERS)}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-blue-50"
            >
              <Icon name="albums-outline" size={18} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        <View className="mt-4">
          <LocationSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearchPress={handleSearch}
            suggestions={searchResults}
            onSelectSuggestion={(item) => {
              moveMapTo(item.latitude, item.longitude);
              setSelectedMarker({
                latitude: item.latitude,
                longitude: item.longitude,
                address: item.displayName
              });
              mapRef.current?.animateToRegion(
                {
                  latitude: item.latitude,
                  longitude: item.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02
                },
                650
              );
            }}
            onClear={() => setSearchQuery('')}
          />
        </View>

        <View className="mt-4 flex-row">
          <View className="mr-2 flex-1">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Map Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {mapTypes.map((item) => {
                const active = mapType === item.value;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setMapType(item.value)}
                    className={`mr-2 rounded-full px-3 py-2 ${active ? 'bg-blue-600' : 'bg-white'}`}
                  >
                    <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <View className="mt-4 flex-1">
          <GoogleMapView
            ref={mapRef}
            region={mapRegion}
            mapType={mapType}
            currentLocation={currentLocation}
            selectedMarker={selectedMarker}
            reminders={nearbyReminders}
            geofence={geofence}
            onMapPress={handleMapPress}
          />
        </View>

        <View className="mt-4">
          <MapLegend />
        </View>

        <View className="mt-4">
          <LocationInfoCard
            location={currentDetails}
            selectedMarker={selectedMarker}
            geofence={geofence}
            distance={selectedMarker && currentLocation ? null : null}
          />
        </View>

        <View className="mt-4">
          <MapBottomSheet
            title={selectedMarker ? 'Selected location' : 'Current location'}
            subtitle={
              selectedMarker
                ? selectedMarker.address || 'Tap save to use this location'
                : 'Track your position and geofence-aware reminders'
            }
            primaryActionLabel="Select Location"
            onPrimaryAction={() => navigation.navigate(routes.SELECT_LOCATION)}
            secondaryActionLabel="Geofence"
            onSecondaryAction={() => navigation.navigate(routes.GEOFENCE)}
            tertiaryActionLabel="Nearby reminders"
            onTertiaryAction={() => navigation.navigate(routes.NEARBY_REMINDERS)}
          />
        </View>
      </View>

      <View className="absolute bottom-6 right-5">
        <View className="mb-3">
          <CurrentLocationButton onPress={handleCurrentLocation} />
        </View>
        <Pressable
          onPress={() => navigation.navigate(routes.ADD_REMINDER)}
          className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-sm"
          style={{ shadowColor: '#1D4ED8' }}
        >
          <Icon name="add" size={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;

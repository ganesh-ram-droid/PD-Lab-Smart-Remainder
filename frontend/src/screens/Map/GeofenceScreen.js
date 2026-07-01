import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/common/Button';
import GoogleMapView from '../../components/map/GoogleMapView';
import LocationInfoCard from '../../components/map/LocationInfoCard';
import MapBottomSheet from '../../components/map/MapBottomSheet';
import MapLegend from '../../components/map/MapLegend';
import ReminderHeader from '../../components/reminder/ReminderHeader';
import useGeofence from '../../hooks/useGeofence';
import useLocation from '../../hooks/useLocation';
import routes from '../../constants/routes';

const radiusPresets = ['50', '100', '250', '500', '1000'];

const GeofenceScreen = ({ navigation, route }) => {
  const mapRef = useRef(null);
  const reminderId = route.params?.reminderId || null;
  const [radiusMode, setRadiusMode] = useState('100');
  const [customRadius, setCustomRadius] = useState('');

  const {
    currentLocation,
    mapRegion,
    mapType,
    selectedMarker,
    geofence,
    loading,
    error,
    requestPermission,
    updateLocation,
    watchLocation,
    stopTracking,
    setGeofence,
    fetchCurrentLocation
  } = useLocation();

  const { createGeofence, updateGeofence, deleteGeofence, checkGeofence } = useGeofence();

  useEffect(() => {
    let subscription;

    const initialize = async () => {
      try {
        await requestPermission();
        await updateLocation();
        subscription = await watchLocation();
      } catch (mapError) {
        Alert.alert('Unable to load geofence', mapError.message);
      }
    };

    initialize();

    return () => {
      stopTracking();
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, [requestPermission, stopTracking, updateLocation, watchLocation]);

  const center = selectedMarker || currentLocation || geofence?.center || null;
  const radiusValue = radiusMode === 'Custom' ? Number(customRadius) : Number(radiusMode);

  const saveGeofence = async () => {
    if (!center) {
      Alert.alert('Missing location', 'Select a location first.');
      return;
    }

    if (!radiusValue || radiusValue <= 0) {
      Alert.alert('Invalid radius', 'Enter a valid radius value.');
      return;
    }

    const payload = {
      reminderId,
      latitude: center.latitude,
      longitude: center.longitude,
      radius: radiusValue
    };

    try {
      const response = geofence?.geofenceId
        ? await updateGeofence(geofence.geofenceId, payload)
        : await createGeofence(payload);
      setGeofence(response.geofence || response);
      Alert.alert('Success', 'Geofence saved successfully.');
    } catch (geofenceError) {
      Alert.alert('Unable to save geofence', geofenceError.message);
    }
  };

  const removeGeofence = async () => {
    if (!geofence?.geofenceId) {
      Alert.alert('No geofence', 'There is no geofence to delete.');
      return;
    }

    try {
      await deleteGeofence(geofence.geofenceId);
      setGeofence(null);
      Alert.alert('Success', 'Geofence deleted successfully.');
    } catch (deleteError) {
      Alert.alert('Unable to delete geofence', deleteError.message);
    }
  };

  const checkCurrentGeofence = async () => {
    if (!center || !radiusValue) {
      Alert.alert('Missing data', 'Create or select a geofence first.');
      return;
    }

    try {
      const result = await checkGeofence({
        reminderId,
        latitude: center.latitude,
        longitude: center.longitude,
        radius: radiusValue,
        currentLatitude: currentLocation?.latitude,
        currentLongitude: currentLocation?.longitude
      });

      Alert.alert('Geofence check', result?.status || result?.decision || 'Geofence evaluated successfully.');
    } catch (checkError) {
      Alert.alert('Unable to check geofence', checkError.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <ReminderHeader
          title="Geofence"
          subtitle="Create and manage reminder boundaries"
          onBackPress={() => navigation.goBack()}
          onRightPress={() => navigation.navigate(routes.MAPS)}
          rightIcon="map-outline"
          rightLabel="Map"
        />

        <View className="mt-4">
          <GoogleMapView
            ref={mapRef}
            region={mapRegion}
            mapType={mapType}
            currentLocation={currentLocation}
            selectedMarker={selectedMarker}
            reminders={[]}
            geofence={{ center, radius: radiusValue }}
          />
        </View>

        <View className="mt-4">
          <MapLegend />
        </View>

        <View className="mt-4">
          <LocationInfoCard location={center} selectedMarker={selectedMarker} geofence={{ radius: radiusValue }} />
        </View>

        <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
          <Text className="mb-3 text-base font-bold text-slate-950">Radius</Text>
          <View className="flex-row flex-wrap">
            {radiusPresets.map((item) => {
              const active = radiusMode === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setRadiusMode(item)}
                  className={`mr-2 mb-2 rounded-full px-3 py-2 ${active ? 'bg-blue-600' : 'bg-slate-100'}`}
                >
                  <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`}>
                    {item} m
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => setRadiusMode('Custom')}
              className={`mr-2 mb-2 rounded-full px-3 py-2 ${radiusMode === 'Custom' ? 'bg-blue-600' : 'bg-slate-100'}`}
            >
              <Text className={`text-sm font-semibold ${radiusMode === 'Custom' ? 'text-white' : 'text-slate-700'}`}>
                Custom
              </Text>
            </Pressable>
          </View>

          {radiusMode === 'Custom' ? (
            <View className="mt-3">
              <Text className="mb-2 text-sm font-semibold text-slate-700">Custom Radius (meters)</Text>
              <TextInput
                value={customRadius}
                onChangeText={setCustomRadius}
                placeholder="Enter radius"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                className="h-12 rounded-2xl bg-slate-50 px-4 text-base text-slate-900"
              />
            </View>
          ) : null}
        </View>

        <View className="mt-4">
          <MapBottomSheet
            title={geofence ? 'Update geofence' : 'Create geofence'}
            subtitle="Use the current or selected location as the center point."
            primaryActionLabel={geofence ? 'Update Geofence' : 'Create Geofence'}
            onPrimaryAction={saveGeofence}
            secondaryActionLabel="Check"
            onSecondaryAction={checkCurrentGeofence}
            tertiaryActionLabel="Delete Geofence"
            onTertiaryAction={removeGeofence}
          />
        </View>

        {error ? (
          <View className="mt-4 rounded-3xl bg-red-50 px-4 py-3">
            <Text className="text-sm font-medium text-red-700">{error}</Text>
          </View>
        ) : null}
      </View>

      <View className="absolute bottom-6 right-5">
        <Pressable
          onPress={async () => {
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
              Alert.alert('Unable to load location', currentError.message);
            }
          }}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm"
          style={{ shadowColor: '#0F172A' }}
        >
          <Icon name="locate-outline" size={20} color="#2563EB" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default GeofenceScreen;

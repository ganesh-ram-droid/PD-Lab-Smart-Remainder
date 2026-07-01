import React, { useEffect, useRef } from 'react';
import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native';

import Button from '../../components/common/Button';
import GoogleMapView from '../../components/map/GoogleMapView';
import NearbyReminderCard from '../../components/map/NearbyReminderCard';
import ReminderHeader from '../../components/map/ReminderHeader';
import useLocation from '../../hooks/useLocation';
import routes from '../../constants/routes';

const NearbyRemindersScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const {
    nearbyReminders,
    currentLocation,
    mapRegion,
    mapType,
    loading,
    error,
    requestPermission,
    updateLocation,
    watchLocation,
    stopTracking,
    loadNearbyReminders,
    setMapType,
    fetchCurrentLocation
  } = useLocation();

  useEffect(() => {
    let subscription;

    const initialize = async () => {
      try {
        await requestPermission();
        await updateLocation();
        subscription = await watchLocation();
        await loadNearbyReminders();
      } catch (mapError) {
        Alert.alert('Unable to load nearby reminders', mapError.message);
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

  const handleNavigate = (reminder) => {
    navigation.navigate(routes.REMINDER_DETAILS, { reminderId: reminder.reminderId });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <ReminderHeader
          title="Nearby Reminders"
          subtitle="Reminders near your current location"
          onBackPress={() => navigation.goBack()}
          onRightPress={() => navigation.navigate(routes.MAPS)}
          rightIcon="map-outline"
          rightLabel="Map"
        />

        <View className="mt-4 flex-1">
          <GoogleMapView
            ref={mapRef}
            region={mapRegion}
            mapType={mapType}
            currentLocation={currentLocation}
            selectedMarker={null}
            reminders={nearbyReminders}
            geofence={null}
          />
        </View>

        <View className="mt-4">
          <Button
            title="Refresh Location"
            variant="secondary"
            onPress={async () => {
              try {
                await fetchCurrentLocation();
                await loadNearbyReminders();
              } catch (refreshError) {
                Alert.alert('Unable to refresh', refreshError.message);
              }
            }}
          />
        </View>

        <View className="mt-4 flex-1">
          <Text className="mb-3 text-base font-bold text-slate-950">Nearby List</Text>
          {error ? (
            <View className="mb-4 rounded-3xl bg-red-50 px-4 py-3">
              <Text className="text-sm font-medium text-red-700">{error}</Text>
            </View>
          ) : null}

          <FlatList
            data={nearbyReminders}
            keyExtractor={(item) => item.reminderId}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <NearbyReminderCard reminder={item} onNavigate={handleNavigate} />}
            ListEmptyComponent={
              <View className="rounded-3xl bg-white px-4 py-8">
                <Text className="text-center text-sm text-slate-500">
                  No nearby reminders found.
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NearbyRemindersScreen;

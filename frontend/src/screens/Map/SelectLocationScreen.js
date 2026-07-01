import React, { useEffect, useRef } from 'react';
import { Alert, SafeAreaView, Text, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import GoogleMapView from '../../components/map/GoogleMapView';
import CurrentLocationButton from '../../components/map/CurrentLocationButton';
import LocationInfoCard from '../../components/map/LocationInfoCard';
import MapBottomSheet from '../../components/map/MapBottomSheet';
import LocationSearchBar from '../../components/map/LocationSearchBar';
import ReminderMarker from '../../components/map/ReminderMarker';
import routes from '../../constants/routes';
import useLocation from '../../hooks/useLocation';
import Button from '../../components/common/Button';

const SelectLocationScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const {
    currentLocation,
    mapRegion,
    mapType,
    searchQuery,
    searchResults,
    selectedMarker,
    setSearchQuery,
    requestPermission,
    updateLocation,
    watchLocation,
    stopTracking,
    searchLocations,
    setSelectedMarker,
    moveMapTo,
    fetchCurrentLocation,
    setMapType
  } = useLocation();

  useEffect(() => {
    let subscription;

    const initialize = async () => {
      try {
        await requestPermission();
        await updateLocation();
        subscription = await watchLocation();
      } catch (error) {
        Alert.alert('Location unavailable', error.message);
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

  const handleSearch = async () => {
    try {
      const results = await searchLocations(searchQuery);
      if (results[0]) {
        const item = results[0];
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
      }
    } catch (error) {
      Alert.alert('Search failed', error.message);
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

  const saveLocation = () => {
    if (!selectedMarker) {
      Alert.alert('Select location', 'Tap on the map or search for a place first.');
      return;
    }

    Alert.alert('Location selected', 'The selected location has been saved for the current session.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <View className="rounded-3xl bg-white px-4 py-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-bold text-slate-950">Select Location</Text>
              <Text className="mt-1 text-xs text-slate-500">Tap on the map to place a reminder marker</Text>
            </View>
            <Pressable
              onPress={() => navigation.goBack()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
            >
              <Icon name="close" size={18} color="#0F172A" />
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
            }}
            onClear={() => setSearchQuery('')}
          />
        </View>

        <View className="mt-4 flex-1">
          <GoogleMapView
            ref={mapRef}
            region={mapRegion}
            mapType={mapType}
            currentLocation={currentLocation}
            selectedMarker={selectedMarker}
            reminders={[]}
            geofence={null}
            onMapPress={handleMapPress}
          />
        </View>

        <View className="mt-4">
          <LocationInfoCard location={selectedMarker || currentLocation} selectedMarker={selectedMarker} />
        </View>

        <View className="mt-4">
          <MapBottomSheet
            title={selectedMarker ? 'Ready to save' : 'Select a location'}
            subtitle={selectedMarker?.address || 'Pick a place on the map or search by name.'}
            primaryActionLabel="Save Location"
            onPrimaryAction={saveLocation}
            secondaryActionLabel="Current Location"
            onSecondaryAction={async () => {
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
              } catch (error) {
                Alert.alert('Unable to load location', error.message);
              }
            }}
          />
        </View>
      </View>

      <View className="absolute bottom-6 right-5">
        <CurrentLocationButton
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
            } catch (error) {
              Alert.alert('Unable to load location', error.message);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelectLocationScreen;

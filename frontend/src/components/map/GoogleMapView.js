import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import GeofenceCircle from './GeofenceCircle';
import MapMarker from './MapMarker';
import ReminderMarker from './ReminderMarker';

const GoogleMapView = forwardRef(
  (
    {
      region,
      mapType,
      currentLocation,
      selectedMarker,
      reminders = [],
      geofence,
      onMapPress,
      onRegionChangeComplete
    },
    ref
  ) => {
    return (
      <View className="overflow-hidden rounded-3xl bg-slate-100 shadow-sm" style={{ shadowColor: '#0F172A' }}>
        <MapView
          ref={ref}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          region={region}
          mapType={mapType}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass
          showsScale
          loadingEnabled
          onPress={onMapPress}
          onRegionChangeComplete={onRegionChangeComplete}
        >
          {currentLocation ? (
            <Marker coordinate={currentLocation} title="Current Location" />
          ) : null}

          {selectedMarker ? (
            <Marker coordinate={selectedMarker} title={selectedMarker.address || 'Selected Location'}>
              <MapMarker color="#2563EB" icon="location" />
            </Marker>
          ) : null}

          {reminders.map((reminder) =>
            reminder.latitude != null && reminder.longitude != null ? (
              <Marker
                key={reminder.reminderId}
                coordinate={{
                  latitude: Number(reminder.latitude),
                  longitude: Number(reminder.longitude)
                }}
                title={reminder.title}
              >
                <ReminderMarker status={reminder.status} />
              </Marker>
            ) : null
          )}

          <GeofenceCircle
            center={selectedMarker || currentLocation || geofence?.center}
            radius={geofence?.radius}
            visible={Boolean(geofence?.radius && (selectedMarker || currentLocation || geofence?.center))}
          />
        </MapView>
      </View>
    );
  }
);

GoogleMapView.displayName = 'GoogleMapView';

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 430
  }
});

export default GoogleMapView;

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { icons } from "@/constants";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import { useFetch } from "@/lib/fetch";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

// @ts-ignore
const Map = ({ showDirections = true }) => {
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [directionsError, setDirectionsError] = useState(false);
  const { selectedDriver, setDrivers } = useDriverStore();
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const mapRef = useRef(null);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) {
        return; // Only return early if no location data
      }

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers]);
  // Fit to markers when they change
  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      setTimeout(() => {
        try {
          // Create an array of identifiers for drivers
          const identifiers = markers.map((marker) =>
            marker.driver_id.toString(),
          );

          // Only add destination if it exists and directions aren't in error state
          if (destinationLatitude && destinationLongitude && !directionsError) {
            identifiers.push("destination");
          }

          // @ts-ignore
          mapRef.current?.fitToSuppliedMarkers(identifiers, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        } catch (error) {
          console.warn("Error fitting map to markers:", error);
        }
      }, 500);
    }
  }, [markers, destinationLatitude, destinationLongitude, directionsError]);

  // Don't render anything if user location is not available
  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        tintColor="black"
        mapType={Platform.select({
          ios: "mutedStandard",
          android: "standard",
        })}
        initialRegion={region}
        showsPointsOfInterest={false}
        showsUserLocation={true}
        userInterfaceStyle="light"
      >
        {markers.map((marker) => (
          <Marker
            key={marker.driver_id}
            identifier={marker.driver_id.toString()}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            image={
              selectedDriver === marker.driver_id
                ? icons.selectedMarker
                : icons.marker
            }
          />
        ))}

        {showDirections &&
          destinationLatitude &&
          destinationLongitude &&
          !directionsError && (
            <>
              <Marker
                key="destination"
                identifier="destination"
                coordinate={{
                  latitude: destinationLatitude,
                  longitude: destinationLongitude,
                }}
                title="Destination"
                image={icons.pin}
              />
              <MapViewDirections
                origin={{
                  latitude: userLatitude,
                  longitude: userLongitude,
                }}
                destination={{
                  latitude: destinationLatitude,
                  longitude: destinationLongitude,
                }}
                apikey={directionsAPI || ""}
                strokeColor="#0286FF"
                strokeWidth={3}
                onError={(error) => {
                  console.warn("MapViewDirections Error:", error);
                  setDirectionsError(true);
                }}
                onReady={(result) => {
                  // If directions load successfully, reset error state
                  setDirectionsError(false);
                }}
              />
            </>
          )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    margin: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;

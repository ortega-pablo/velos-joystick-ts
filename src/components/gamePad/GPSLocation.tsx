import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/store';



const GPSLocation = () => {
  const deviceLatitude = useAppSelector((state) => state.ble.latitudeValue)
  const deviceLongitude = useAppSelector((state) => state.ble.longitudeValue)

  useEffect(() => {
    console.log('Latitud actualizada: ', deviceLatitude)
  } , [deviceLatitude])

  useEffect(() => {
    console.log('Longitud actualizada: ', deviceLongitude)
  } , [deviceLongitude])

  return (
    <View style={styles.container}>
      <Ionicons name="location-outline" size={50} color="black" />
      <View>
      <Text style={styles.locationText}>
        Latitud: {deviceLatitude !== null ? `${deviceLatitude}` : "Unknown"}
      </Text>
      <Text style={styles.locationText}>
        Longitud: {deviceLongitude !== null ? `${deviceLongitude}` : "Unknown"}
      </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 50,
    flexDirection: "row",
    borderRadius: 20,
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default GPSLocation;

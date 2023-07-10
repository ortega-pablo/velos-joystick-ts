import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GPSLocationProps {
  latitude: number; // Latitud del dispositivo externo
  longitude: number; // Longitud del dispositivo externo
}

const GPSLocation: React.FC<GPSLocationProps> = ({ latitude, longitude }) => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 }); // Coordenadas GPS actuales del componente

  useEffect(() => {
    // Actualizar las coordenadas GPS del componente cuando cambian las coordenadas del dispositivo externo
    setLocation({ latitude, longitude });
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      <Ionicons name="location-outline" size={50} color="black" />
      <View>
      <Text style={styles.locationText}>
        Latitud: {location.latitude.toFixed(6)}
      </Text>
      <Text style={styles.locationText}>
        Longitud: {location.longitude.toFixed(6)}
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

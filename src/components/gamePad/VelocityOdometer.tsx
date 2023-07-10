import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SpeedometerProps {
  deviceSpeed: number; // Velocidad del dispositivo externo
}

const VelocityOdometer: React.FC<SpeedometerProps> = ({ deviceSpeed }) => {
  const [speed, setSpeed] = useState(0); // Velocidad actual del componente

  useEffect(() => {
    // Actualizar la velocidad del componente cuando cambia la velocidad del dispositivo externo
    setSpeed(deviceSpeed);
  }, [deviceSpeed]);

  return (
    <View style={styles.container}>
      <Ionicons name="speedometer-outline" size={50} color="black" />
      <Text style={styles.speedText}>{speed} km/h</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  
  },
  speedText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
});

export default VelocityOdometer;
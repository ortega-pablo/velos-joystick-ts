import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BatteryLevelProps {
  deviceBatteryLevel: number; // Nivel de batería del dispositivo externo (0-100)
}

const BatteryLevel: React.FC<BatteryLevelProps> = ({ deviceBatteryLevel }) => {
  const [batteryLevel, setBatteryLevel] = useState(0); // Nivel de batería actual del componente

  useEffect(() => {
    // Actualizar el nivel de batería del componente cuando cambia el nivel de batería del dispositivo externo
    setBatteryLevel(deviceBatteryLevel);
  }, [deviceBatteryLevel]);

  return (
    <View style={styles.container}>
      <Ionicons name="battery-full-outline" size={50} color="black" />
      <Text style={styles.batteryLevelText}>{batteryLevel}%</Text>
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
  batteryLevelText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BatteryLevel;

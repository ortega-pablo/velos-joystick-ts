import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { startListening } from '../../redux/slice';


const BatteryLevel = () => {
  const dispatch = useAppDispatch()

  const deviceBatteryLevel = useAppSelector((state) => state.ble.batteryValue)

 useEffect(() => {
    dispatch(startListening());
  }, []);
 
  return (
    <View style={styles.container}>
      <Ionicons name="battery-full-outline" size={50} color="black" />
      <Text style={styles.batteryLevelText}>{deviceBatteryLevel !== null ? deviceBatteryLevel : '0'}%</Text>
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

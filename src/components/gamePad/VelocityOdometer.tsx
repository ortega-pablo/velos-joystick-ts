import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../redux/store";

const VelocityOdometer = () => {
  const deviceVelocity = useAppSelector((state) => state.ble.velocityValue);

  useEffect(() => {
    console.log('Velocidad actualizada: ', deviceVelocity)
  } , [deviceVelocity]); 

  return (
    <View style={styles.container}>
      <Ionicons name='speedometer-outline' size={50} color='black' />
      <Text style={styles.speedText}>{deviceVelocity !== null ? `${deviceVelocity}` : "Unknown"} km/h</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  speedText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default VelocityOdometer;

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { BleManager, Device } from "react-native-ble-plx";
import useBLE from "../utils/useBLE";
import DeviceModal from "../components/DeviceConnectionModal";

interface BluetoothPairingProps {
  navigation: NavigationProp<any, any>;
}

const BluetoothPairing = ({ navigation }: BluetoothPairingProps) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { requestPermissions, scanForDevices, allDevices, connectToDevice } =
    useBLE();

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    requestPermissions((isGranted: boolean) => {
      if (isGranted) {
        scanForDevices();
        setIsModalVisible(true);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/logo-velos.png")}
        style={styles.logo}
      />
      <Text style={styles.titleText}>Dispositivos bluetooth</Text>
      {allDevices.map((device: Device) => (
        <Text key={device.id}>
          {device.name}
          {device.id}
        </Text>
      ))}

      <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>{"Buscar"}</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "withe",
  },
  logo: {
    width: 250,
    resizeMode: "contain",
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  ctaButton: {
    backgroundColor: "#005969",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 150,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default BluetoothPairing;

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
import { BleManager, Device } from "react-native-ble-plx";
import useBLE from "../utils/useBLE";
import DeviceModal from "../components/DeviceConnectionModal";

const BluetoothPairing = () => {
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
      <View style={styles.titleWrapper}>
        <Image
          source={require("../../assets/logo-velos.png")}
          style={styles.logo}
        />
        <Text style={styles.titleText}>Bluetooth Devices</Text>
        {allDevices.map((device: Device) => (
          <Text key={device.id}>
            {device.name}
            {device.id}
          </Text>
        ))}
      </View>
      <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>{"Conectar"}</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A6E3EA",
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
    marginHorizontal: 20,
    color: "black",
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
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

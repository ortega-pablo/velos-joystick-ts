import React, { FC, useEffect, useState } from "react";
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
import DeviceModal from "../components/DeviceModal";
import { useAppSelector } from "../redux/store";

type BluetoothPairingProps = {
  navigation: NavigationProp<any, any>;
}

const BluetoothPairing: FC<BluetoothPairingProps> = (props) => {

  const { navigation } = props;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  
  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/logo-velos.png")}
        style={styles.logo}
      />
      <Text style={styles.titleText}>Dispositivos bluetooth</Text>

      <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>{"Buscar Dispositivos"}</Text>
      </TouchableOpacity>
      <DeviceModal // Mostramos el componente DeviceModal
        navigation={navigation}
        closeModal={hideModal}
        visible={isModalVisible}
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

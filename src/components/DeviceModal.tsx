import React, { useEffect, useCallback, FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Device } from "react-native-ble-plx";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { DeviceReference } from "../redux/BluetoothManager";
import { startScanning } from "../redux/slice";
import { connectToDevice } from "../redux/listener";
import { TouchableOpacity } from "react-native-gesture-handler";

type DeviceModalProps = {
  visible: boolean;
  closeModal: () => void;
  navigation: NavigationProp<any, any>;
};

const DeviceModal: FC<DeviceModalProps> = (props) => {
  const { closeModal, navigation, visible } = props;
  const dispatch = useAppDispatch();
  const discoveredDevices = useAppSelector((state) => state.ble.allDevices);

  const askConnect = (deviceId: any) =>
    Alert.alert(
      "Conectar dispositivo",
      "¿Seguro que desea conectarse a este dispositivo?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: () => {
            dispatch(connectToDevice(deviceId));
            closeModal();
            navigation.navigate("GamePad");
          },
        },
      ]
    );

  useEffect(() => {
    dispatch(startScanning());
    {console.log('Lista de dispositivos', discoveredDevices)}
  }, []); 

  const onDeviceSelected = (deviceId: any) => {
    askConnect(deviceId);
  };

  return (
    <Modal
      style={styles.modalContainer}
      animationType='slide'
      transparent={false}
      visible={visible}
    >
      <SafeAreaView style={styles.modalTitle}>
        <Text style={styles.modalTitleText}>Seleccione un dispositivo</Text>
        
        <FlatList
          style={styles.modalFlatlistContiner}
          data={discoveredDevices}
          renderItem={({ item }) => {
            const selectDevice = () => {
              onDeviceSelected(item);
            };

            return (
              <Pressable style={styles.ctaButton} onPress={selectDevice}>
                <Text style={styles.ctaButtonText}>{item.name}</Text>
              </Pressable>
            );
          }}
        />
        <Pressable
          style={styles.ctaButton}
          onPress={() => closeModal()}
        >
          <Text style={styles.ctaButtonText}>Cancelar</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  modalFlatlistContiner: {
    marginVertical: 120,
    flex: 1,
    marginHorizontal: 20,
    
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },

  modalTitle: {
    flex: 1,
    alignContent: "center",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#005969",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default DeviceModal;

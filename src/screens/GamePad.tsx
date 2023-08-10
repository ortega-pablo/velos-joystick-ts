import React, { FC, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, Alert } from "react-native";
import VelocityOdometer from "../components/gamePad/VelocityOdometer";
import BatteryLevel from "../components/gamePad/BatteryLevel";
import GPSLocation from "../components/gamePad/GPSLocation";
import { Device } from "react-native-ble-plx";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setBatteryLevel, setLatitude, setLongitude, setVelocity, startListening, startListeningParams } from "../redux/slice";
import { disconnectDevice, readBatteryLevelFromDevice, readLatitudeFromDevice, readLongitudeFromDevice, readVelocityFromDevice, sendGamepadValue } from "../redux/listener";
import { NavigationProp } from "@react-navigation/native";
import { DeviceReference } from "../redux/BluetoothManager";

type GamepadProps = { 
  navigation: NavigationProp<any, any>;
};

const GamePad: FC<GamepadProps> = (props) => {

  const { navigation } = props;
  const connectedDevice = useAppSelector((state) => state.ble.connectedDevice);

  const dispatch = useAppDispatch();
 
  useEffect(() => {
    console.log('Entro al useEffect de Gamepad')
    dispatch(startListeningParams());
  }, []);
 
  const sendData = (gamepadValue: string) => {
    dispatch(sendGamepadValue(gamepadValue));
  };

  const handleButtonPress = (buttonValue: string) => {
    console.log(`Button pressed: ${buttonValue}`);
  };
  
  const handleDisconnect = () => 
    Alert.alert(
      "Desconectar dispositivo",
      "¿Seguro que desea salir?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: () => {
            if (connectedDevice) {
              dispatch(disconnectDevice(connectedDevice));
            }
            navigation.navigate("BluetoothPairing");
          },
        },
      ]
    );

  return (
    <View style={styles.container}> 
      <View style={styles.titleWrapper}>
        <Image
          source={require("../../assets/logo-velos.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.row}>
        <VelocityOdometer />
        <BatteryLevel />
      </View>

      <View style={styles.joystick}>
        <TouchableOpacity
          style={[styles.button, styles.topButton]}
          onPress={() => sendData("U")}
        >
          <Text style={styles.buttonText}>▲</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => sendData("L")}>
            <Text style={styles.buttonText}>◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => sendData("S")}
          >
            <Text style={styles.buttonText}>Detener</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => sendData("R")}>
            <Text style={styles.buttonText}>▶</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.bottomButton]}
          onPress={() => sendData("D")}
        >
          <Text style={styles.buttonText}>▼</Text>
        </TouchableOpacity>
      </View>

      <GPSLocation />

      <View style={styles.rowLarge}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDisconnect()}
        >
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("Next Option")}
        >
          <Text style={styles.buttonText}>Más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "white",
  },
  titleWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  logo: {
    width: 100,
    resizeMode: "contain",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  rowLarge: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#005969",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  joystick: {
    justifyContent: "center",
    alignItems: "center",
  },
  topButton: {
    marginBottom: 20,
  },
  bottomButton: {
    marginTop: 20,
  },
  centerButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});

export default GamePad;

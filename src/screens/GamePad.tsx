import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import VelocityOdometer from "../components/gamePad/VelocityOdometer";
import BatteryLevel from "../components/gamePad/BatteryLevel";
import GPSLocation from "../components/gamePad/GPSLocation";

const GamePad = () => {
  const handleButtonPress = (buttonName: string) => {
    // Lógica para manejar la pulsación de los botones
    console.log(`Button pressed: ${buttonName}`);
  };

  return (
    <View style={styles.container}>
        <View style={styles.titleWrapper}>
        <Image
          source={require("../../assets/logo-velos.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.row}>
        <VelocityOdometer deviceSpeed={150.5} />
        <BatteryLevel deviceBatteryLevel={60} />
      </View>

      <View style={styles.joystick}>
        <TouchableOpacity
          style={[styles.button, styles.topButton]}
          onPress={() => handleButtonPress("Arriba")}
        >
          <Text style={styles.buttonText}>▲</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("Izquierda")}
          >
            <Text style={styles.buttonText}>◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => handleButtonPress("Botón central")}
          >
            <Text style={styles.buttonText}>Detener</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("Derecha")}
          >
            <Text style={styles.buttonText}>▶</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.bottomButton]}
          onPress={() => handleButtonPress("Abajo")}
        >
          <Text style={styles.buttonText}>▼</Text>
        </TouchableOpacity>
      </View>

      <GPSLocation latitude={-34.605425} longitude={-58.381555} />

      <View style={styles.rowLarge}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("Salir")}
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

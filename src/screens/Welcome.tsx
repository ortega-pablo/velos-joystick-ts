import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { NavigationProp } from "@react-navigation/native";
import { Image } from "react-native";

interface WelcomeProps {
  navigation: NavigationProp<any, any>;
}

const Welcome = ({ navigation }: WelcomeProps) => {
  useEffect(() => {
    const delay = 2000;
    const timer = setTimeout(() => {
      navigation.navigate("BluetoothPairing");
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/logo-velos.png")}
          style={styles.logo}
        />
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  logo: {
    width: 250,
    resizeMode: "contain",
  },
});

import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleManager,
  BleError,
  Characteristic,
  Device,
} from "react-native-ble-plx";
import base64 from "react-native-base64";
import * as ExpoDevice from "expo-device";

const ServiceUUID = "4fdc2362-1e72-11ee-be56-0242ac120002";
const characteristicsUUID = {
  gamePad: "58d3d514-1e72-11ee-be56-0242ac120002",
  velocity: "5d269868-1e72-11ee-be56-0242ac120002",
  battery: "64bd7286-1e72-11ee-be56-0242ac120002",
  latitude: "6be2ff7c-1e72-11ee-be56-0242ac120002",
  longitude: "71120a60-1e72-11ee-be56-0242ac120002",
};

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  myDevice: Device | null;
  allDevices: Device[];
  batteryLevel: string;
  changeGamepad(newValue: string): Promise<void>;
}

const bleManager = new BleManager();

export default function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [myDevice, setMyDevice] = useState<Device | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<string>('0');

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
  bleManager.startDeviceScan(
    [],
    null,
    (error: BleError | null, device: Device | null) => {
      if (error) {
        console.log("Scan error:", error);
        alert("Por favor conectar Bluetooth");
        return;
      }

      setAllDevices((prevDevices) => {
        if (!prevDevices.some((prevDevice) => prevDevice?.id === device?.id)) {
          device?.name === null && (device.name = "Dispositivo desconocido");
          return [...prevDevices.filter(Boolean), device].filter(Boolean) as Device[];
        }
        return prevDevices;
      });
      console.log("AllDevices: ", allDevices)
    }
  );

  /* const scanForDevices = () => {
    bleManager.startDeviceScan(
      [],
      null,
      (error: BleError | null, device: Device | null) => {
        if (error) {
          console.log("Scan error:", error);
          alert("Por favor conectar Bluetooth");
          return;
        }

        setAllDevices((prevDevices) => {
          if (!prevDevices.some((prevDevice) => prevDevice?.id === device?.id)) {
            device?.name === null && (device.name = "Dispositivo desconocido");
            return [...prevDevices.filter(Boolean), device].filter(Boolean) as Device[];
          }
          return prevDevices;
        });
      }
    );
  }; */

  const connectToDevice = async (device: Device)=> {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);

      if (deviceConnection) {
        const discovered = await bleManager.discoverAllServicesAndCharacteristicsForDevice(deviceConnection.id)
        const services = await deviceConnection.services()
        const gamepadCharacteristic = deviceConnection.readCharacteristicForService(
          ServiceUUID,
          characteristicsUUID.gamePad,
        )
        console.log('Característica GAMEPAD: ', gamepadCharacteristic)
        setMyDevice((prevDevice) => {
          if (prevDevice !== discovered) {
            return discovered;
          }
          return prevDevice;
        });
        
      }
      bleManager.stopDeviceScan();
      console.log('myDevice: ', myDevice)
    } catch (e) {
      console.log("Fallo al conectar", e);
    }
  };

  const disconnectFromDevice = () => {
    if (myDevice) {
      bleManager.cancelDeviceConnection(myDevice.id);
      setMyDevice(null);
      setBatteryLevel('0');
    }
  };

  const velosBatteryRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    console.log('characteristic: ', characteristic)
    if (error) {
      console.log('Es este?',error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No se ha recibido información");
      return -1;
    } else {

      const rawData = base64.decode(characteristic.value);
      

      console.log("Battery level: ", rawData);

      setBatteryLevel(rawData);
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.gamePad,
        (velosBatteryRateUpdate)
      );
    } else {
      console.log("No Device Connected");
    }
  };

  const changeGamepad = async (newValue: string) => {
    try {
      newValue = base64.encode(newValue)
      myDevice &&
      await bleManager.writeCharacteristicWithResponseForDevice(
        myDevice.id,
        ServiceUUID,
        characteristicsUUID.gamePad,
        newValue,
      ).then((response) => {console.log('Esta es la respuesta del write: ', response);})
      console.log('Valor enviado correctamente');
    } catch (e) {
      console.log(e);
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    myDevice,
    disconnectFromDevice,
    batteryLevel,
    changeGamepad
  };
}

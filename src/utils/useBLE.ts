import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, Characteristic, Device } from "react-native-ble-plx";
import { atob } from "react-native-quick-base64"

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
  requestPermissions(callback: PermissionCallback): Promise<void>;
  connectToDevice(device: Device): Promise<void>;
  scanForDevices(): void;
  allDevices: Device[];
}

export default function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [device, setConnectedDevice] = useState<Device | null>(null);

  const requestPermissions = async (callback: PermissionCallback) => {
    if (Platform.OS === "android") {
      const grantedStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Bluetooth Low Energy Needs Location Permission",
          buttonNeutral: "Maybe Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      callback(true);
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForDevices = () => {
    bleManager.startDeviceScan(
      null,
      null,
      (error: any, device: Device | null) => {
        if (error) {
          console.log("Scan error:", error);
          alert("Por favor conectar Bluetooth");
          return;
        }

        setAllDevices((prevDevices) => {
          if (
            !prevDevices.some((prevDevice) => prevDevice?.id === device?.id)
          ) {
            const updatedDevices = prevDevices.filter(
              (prevDevice) => prevDevice !== null
            ) as Device[];
            device?.name === null && (device.name = "Dispositivo desconocido")
            return [...updatedDevices, device].filter(
              (device) => device !== null
            ) as Device[];
          }
          return prevDevices;
        });
      }
    );
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      bleManager.stopDeviceScan();
    } catch (error) {
      console.log("Error al conectar:", error);
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService("", "", () => {});
    } else {
      console.log("Dispositivo no conectado");
    }
  };

  const characteristicUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error)
      return
    } else if (!characteristic?.value) {
      console.log('No characteristic Found')
      return
    }
  }

  //const rawData = atob(characteristic.value)

  return {
    requestPermissions,
    scanForDevices,
    allDevices,
    connectToDevice,
  };
}

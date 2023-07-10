import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";
import { atob } from "react-native-quick-base64";

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
  requestPermissions(callback: PermissionCallback): Promise<void>;
  connectToDevice(device: Device): Promise<void>;
  scanForDevices(): void;
  allDevices: Device[];
  connectedDevice: Device | null;
  characteristicUpdate: (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => void;
}

export default function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const ServiceUUID = "4fdc2362-1e72-11ee-be56-0242ac120002";
  const characteristicsUUID = {
    gamePad: "58d3d514-1e72-11ee-be56-0242ac120002",
    velocity: "5d269868-1e72-11ee-be56-0242ac120002",
    battery: "64bd7286-1e72-11ee-be56-0242ac120002",
    latitude: "6be2ff7c-1e72-11ee-be56-0242ac120002",
    longitude: "71120a60-1e72-11ee-be56-0242ac120002",
  };

  const requestPermissions = async (callback: PermissionCallback) => {
    if (Platform.OS === "android") {
      const grantedStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Velos necesita permisos de localización",
          buttonNeutral: "Luego",
          buttonNegative: "Cancelar",
          buttonPositive: "Permitir",
        }
      );
      callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      callback(true);
    }
  };

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
            device?.name === null && (device.name = "Dispositivo desconocido");
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
      await bleManager.stopDeviceScan();
      device.connect()
      .then((device) => {
        return device.discoverAllServicesAndCharacteristics()
    })
    .then((device) => {
       console.log('Este es el device: ', device)
    }).catch((error) => {
      console.log('Error al conectar el dispositivo')
  });
      /* const connectedDevice = await bleManager.connectToDevice(device.id);
      setConnectedDevice(connectedDevice);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      startStreamingData(connectedDevice);
      connectedDevice.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.gamePad,
        characteristicUpdate
      );
      connectedDevice.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.velocity,
        characteristicUpdate
      );
      connectedDevice.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.battery,
        characteristicUpdate
      );
      connectedDevice.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.latitude,
        characteristicUpdate
      );
      connectedDevice.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.longitude,
        characteristicUpdate
      ); */
    } catch (error) {
      console.log("Error al conectar:", error);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.gamePad,
        (error: BleError | null, characteristic: Characteristic | null) => {
          const rawData = atob(characteristic?.value ?? "");
          if (error) {
            console.log(error);
          } else if (!characteristic?.value) {
            console.log("No characteristic Found");
          } else {
            console.log("rawData: ", rawData);
            console.log("Valor de la característica: ", characteristic?.value);
          }
        }
      );

      device.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.velocity,
        (error: BleError | null, characteristic: Characteristic | null) => {
          const rawData = atob(characteristic?.value ?? "");
          if (error) {
            console.log(error);
          } else if (!characteristic?.value) {
            console.log("No characteristic Found");
          } else {
            console.log("rawData: ", rawData);
            console.log("Valor de la característica: ", characteristic?.value);
          }
        }
      );

      device.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.battery,
        (error: BleError | null, characteristic: Characteristic | null) => {
          const rawData = atob(characteristic?.value ?? "");
          if (error) {
            console.log(error);
          } else if (!characteristic?.value) {
            console.log("No characteristic Found");
          } else {
            console.log("rawData: ", rawData);
            console.log("Valor de la característica: ", characteristic?.value);
          }
        }
      );

      device.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.latitude,
        (error: BleError | null, characteristic: Characteristic | null) => {
          const rawData = atob(characteristic?.value ?? "");
          if (error) {
            console.log(error);
          } else if (!characteristic?.value) {
            console.log("No characteristic Found");
          } else {
            console.log("rawData: ", rawData);
            console.log("Valor de la característica: ", characteristic?.value);
          }
        }
      );

      device.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.longitude,
        (error: BleError | null, characteristic: Characteristic | null) => {
          const rawData = atob(characteristic?.value ?? "");
          if (error) {
            console.log(error);
          } else if (!characteristic?.value) {
            console.log("No characteristic Found");
          } else {
            console.log("rawData: ", rawData);
            console.log("Valor de la característica: ", characteristic?.value);
          }
        }
      );
    } else {
      console.log("Dispositivo no conectado");
    }
  };

  const characteristicUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    const rawData = atob(characteristic?.value ?? "");

    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log("No characteristic Found");
      return;
    } else {
      console.log("rawData: ", rawData);
      console.log("Valor de la característica: ", characteristic?.value);
      return;
    }
  };

  return {
    requestPermissions,
    scanForDevices,
    allDevices,
    connectedDevice,
    connectToDevice,
    characteristicUpdate,
  };
}

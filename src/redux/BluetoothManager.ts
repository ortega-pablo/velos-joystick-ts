import base64 from "react-native-base64";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

export interface DeviceReference {
  name?: string | null;
  id?: string;
}

const ServiceUUID = "4fdc2362-1e72-11ee-be56-0242ac120002";
const characteristicsUUID = {
  gamePad: "58d3d514-1e72-11ee-be56-0242ac120002",
  velocity: "5d269868-1e72-11ee-be56-0242ac120002",
  battery: "64bd7286-1e72-11ee-be56-0242ac120002",
  latitude: "6be2ff7c-1e72-11ee-be56-0242ac120002",
  longitude: "71120a60-1e72-11ee-be56-0242ac120002",
};

class BluetoothLeManager {
  bleManager: BleManager;
  device: Device | null;
  isListening = false;

  constructor() {
    this.bleManager = new BleManager();
    this.device = null;
  }

  scanForPeripherals = (
    onDeviceFound: (deviceSummary: DeviceReference) => void
  ) => {
    this.bleManager.startDeviceScan(null, null, (_, scannedDevice) => {
      onDeviceFound({
        id: scannedDevice?.id,
        name: scannedDevice?.localName ?? scannedDevice?.name,
      });
    });
  };

  stopScanningForPeripherals = () => {
    this.bleManager.stopDeviceScan();
  };

  connectToPeripheral = async (identifier: string) => {
    this.device = await this.bleManager.connectToDevice(identifier);
    await this.device?.discoverAllServicesAndCharacteristics();
  };

  batteryUpdate = (
    error: BleError | null,
    charactaristic: Characteristic | null,
    emitter: (bleValue: { payload: string | BleError }) => void
  ) => {
    if (error) {
      console.log("ERROR", error);
      emitter({ payload: "#FFFFFF" });
    }
    const batteryLevel = base64.decode(charactaristic?.value!);
    emitter({ payload: batteryLevel });
  };

  startStreamingData = async (
    emitter: (bleValue: { payload: string | BleError }) => void
  ) => {
    if (!this.isListening) {
      this.isListening = true;
      this.device?.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.battery,
        (error, charactaristic) => {
          this.batteryUpdate(error, charactaristic, emitter);
        }
      );
    }
  };
}


const manager = new BluetoothLeManager();

export default manager;

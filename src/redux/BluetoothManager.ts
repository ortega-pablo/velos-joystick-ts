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
    console.log("Se ha conectado con el dispositivo: ", this.device);
    await this.device?.discoverAllServicesAndCharacteristics();
    console.log('Caracterísitcas decubiertas exitosamente')
  };


  readBatteryLevel = async () => {
    if (!this.device) {
      console.log("Device is not connected."); // Optional error handling, you can choose how to handle this case.
      return null;
    }
    try {
      const batteryLevelCharacteristic =
        await this.bleManager.readCharacteristicForDevice(
          this.device.id!,
          ServiceUUID,
          characteristicsUUID.battery
        );
      const batteryValue = batteryLevelCharacteristic.value;
      if (batteryValue) {
        return base64.decode(batteryValue);
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error al leer nivel de batería ", error);
      return null;
    }
  };

  readVelocity = async () => {
    if (!this.device) {
      console.log("Device is not connected."); // Optional error handling, you can choose how to handle this case.
      return null;
    }
    try {
      const velocityCharacteristic =
        await this.bleManager.readCharacteristicForDevice(
          this.device.id!,
          ServiceUUID,
          characteristicsUUID.velocity
        );
      const velocityValue = velocityCharacteristic.value;
      if (velocityValue) {
        return base64.decode(velocityValue);
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error al leer nivel de batería ", error);
      return null;
    }
  };

  readLatitude = async () => {
    if (!this.device) {
      console.log("Device is not connected."); // Optional error handling, you can choose how to handle this case.
      return null;
    }
    try {
      const latitudeCharacteristic =
        await this.bleManager.readCharacteristicForDevice(
          this.device.id!,
          ServiceUUID,
          characteristicsUUID.latitude
        );
      const latitudeValue = latitudeCharacteristic.value;
      if (latitudeValue) {
        return base64.decode(latitudeValue);
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error al leer nivel de batería ", error);
      return null;
    }
  };

  readLongitude = async () => {
    if (!this.device) {
      console.log("Device is not connected."); // Optional error handling, you can choose how to handle this case.
      return null;
    }
    try {
      const longitudeCharacteristic =
        await this.bleManager.readCharacteristicForDevice(
          this.device.id!,
          ServiceUUID,
          characteristicsUUID.longitude
        );
      const longitudeValue = longitudeCharacteristic.value;
      if (longitudeValue) {
        return base64.decode(longitudeValue);
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error al leer nivel de batería ", error);
      return null;
    }
  };

  sendValue = async (value: string) => {
    const data = base64.encode(value);
    try {
      await this.bleManager.writeCharacteristicWithResponseForDevice(
        this.device?.id ?? "",
        ServiceUUID,
        characteristicsUUID.gamePad,
        data
      );
    } catch (e) {
      console.log(e);
    }
  };

  onBatteryLevelUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
    emitter: (batteryValue: string | null) => void
  ) => {
    if (error) {
      console.log("ERROR", error);
      emitter(null);
      return;
    }
    if (characteristic?.value) {
      const batteryValue = base64.decode(characteristic.value);
      emitter(batteryValue);
    }
  };

  onVelocityUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
    emitter: (velocityValue: string | null) => void
  ) => {
    if (error) {
      console.log("ERROR", error);
      emitter(null);
      return;
    }
    if (characteristic?.value) {
      const velocityValue = base64.decode(characteristic.value);
      emitter(velocityValue);
    }
  };

  onLatitudeUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
    emitter: (latitudeValue: string | null) => void
  ) => {
    if (error) {
      console.log("ERROR", error);
      emitter(null);
      return;
    }
    if (characteristic?.value) {
      const latitudeValue = base64.decode(characteristic.value);
      emitter(latitudeValue);
    }
  };

  onLongitudeUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
    emitter: (longitudeValue: string | null) => void
  ) => {
    if (error) {
      console.log("ERROR", error);
      emitter(null);
      return;
    }
    if (characteristic?.value) {
      const longitudeValue = base64.decode(characteristic.value);
      emitter(longitudeValue);
    }
  };

  startStreamingBatteryLevel = async (emitter: (batteryValue: string | null) => void) => {
    if (!this.isListening) {
      this.isListening = true;
    }
    this.device?.monitorCharacteristicForService(
      ServiceUUID,
      characteristicsUUID.battery,
      (error, characteristic) => {
        this.onBatteryLevelUpdate(error, characteristic, emitter);
      }
    );
  };

  startStreamingVelocity = async (emitter: (velocityValue: string | null) => void) => {
    if (!this.isListening) {
      this.isListening = true;
    }
    this.device?.monitorCharacteristicForService(
      ServiceUUID,
      characteristicsUUID.velocity,
      (error, characteristic) => {
        this.onVelocityUpdate(error, characteristic, emitter);
      }
    );
  };

  startStreamingLatitude = async (emitter: (latitudeValue: string | null) => void) => {
    if (!this.isListening) {
      this.isListening = true;
    }
    this.device?.monitorCharacteristicForService(
      ServiceUUID,
      characteristicsUUID.latitude,
      (error, characteristic) => {
        this.onLatitudeUpdate(error, characteristic, emitter);
      }
    );
  };

  startStreamingLongitude = async (emitter: (longitudeValue: string | null) => void) => {
    if (!this.isListening) {
      this.isListening = true;
    }
    this.device?.monitorCharacteristicForService(
      ServiceUUID,
      characteristicsUUID.longitude,
      (error, characteristic) => {
        this.onLongitudeUpdate(error, characteristic, emitter);
      }
    );
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

  velocityUpdate = (
    error: BleError | null,
    charactaristic: Characteristic | null,
    emitter: (bleValue: { payload: string | BleError }) => void
  ) => {
    if (error) {
      console.log("ERROR", error);
      emitter({ payload: "#FFFFFF" });
    }
    const velocityValue = base64.decode(charactaristic?.value!);
    emitter({ payload: velocityValue });
  };

  latitudeUpdate = (
    error: BleError | null,
    charactaristic: Characteristic | null,
    emitter: (bleValue: { payload: string | BleError }) => void
  ) => {
    if (error) {
      console.log("ERROR", error);
      emitter({ payload: "#FFFFFF" });
    }
    const latitudeValue = base64.decode(charactaristic?.value!);
    emitter({ payload: latitudeValue });
  };

  longitudeUpdate = (
    error: BleError | null,
    charactaristic: Characteristic | null,
    emitter: (bleValue: { payload: string | BleError }) => void
  ) => {
    if (error) {
      console.log("ERROR", error);
      emitter({ payload: "#FFFFFF" });
    }
    const longitudeValue = base64.decode(charactaristic?.value!);
    emitter({ payload: longitudeValue });
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

      this.device?.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.velocity,
        (error, charactaristic) => {
          this.velocityUpdate(error, charactaristic, emitter);
        }
      );

      this.device?.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.latitude,
        (error, charactaristic) => {
          this.latitudeUpdate(error, charactaristic, emitter);
        }
      );

      this.device?.monitorCharacteristicForService(
        ServiceUUID,
        characteristicsUUID.longitude,
        (error, charactaristic) => {
          this.longitudeUpdate(error, charactaristic, emitter);
        }
      );
    }
  };
}

const manager = new BluetoothLeManager();

export default manager;

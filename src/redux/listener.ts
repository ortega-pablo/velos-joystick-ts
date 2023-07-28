import { createAsyncThunk, createListenerMiddleware } from "@reduxjs/toolkit";
import {
  setBatteryLevel,
  setVelocity,
  setLatitude,
  setLongitude,
  setConnectedDevice,
  setDevice,
  startListening,
  startListeningParams,
  startScanning,
} from "./slice";

import bluetoothLeManager, { DeviceReference } from "./BluetoothManager";

export const bleMiddleware = createListenerMiddleware();

export const connectToDevice = createAsyncThunk(
  "bleThunk/connectToDevice",
  async (ref: DeviceReference, thunkApi) => {
    if (ref.id) {
      try {
        await bluetoothLeManager.connectToPeripheral(ref.id);
        thunkApi.dispatch(setConnectedDevice(ref));
        bluetoothLeManager.stopScanningForPeripherals();
        readBatteryLevelFromDevice()
        readVelocityFromDevice()
        readLatitudeFromDevice()
        readLongitudeFromDevice()
      } catch (error) {
        console.log('Ha ocurrido un error al conectar el dispositivo: ', error);
      }
    }
  }
);

export const readBatteryLevelFromDevice = createAsyncThunk(
  "bleThunk/readBatteryLevelFromDevice",
  async (_, thunkApi) => {
    const batteryValue = await bluetoothLeManager.readBatteryLevel();
   thunkApi.dispatch(setBatteryLevel(batteryValue));
  }
);

export const readVelocityFromDevice = createAsyncThunk(
  "bleThunk/readVelocityFromDevice",
  async (_, thunkApi) => {
    const velocityValue = await bluetoothLeManager.readVelocity();
    thunkApi.dispatch(setVelocity(velocityValue));
  }
);

export const readLatitudeFromDevice = createAsyncThunk(
  "bleThunk/readLatitudeFromDevice",
  async (_, thunkApi) => {
    const latitudeValue = await bluetoothLeManager.readLatitude();
    thunkApi.dispatch(setLatitude(latitudeValue));
  }
);

export const readLongitudeFromDevice = createAsyncThunk(
  "bleThunk/readLongitudeFromDevice",
  async (_, thunkApi) => {
    const longitudeValue = await bluetoothLeManager.readLongitude();
    thunkApi.dispatch(setLongitude(longitudeValue));
  }
);

bleMiddleware.startListening({
  actionCreator: startScanning,
  effect: (_, listenerApi) => {
    bluetoothLeManager.scanForPeripherals((device) => {
      if (!device.name) {
        device.name = "Dispositivo desconocido";
      }
      listenerApi.dispatch(setDevice(device));
    });
  },
});

export const sendGamepadValue = createAsyncThunk(
  "bleThunk/sendGamepadValue",
  async (value: string, _) => {
    await bluetoothLeManager.sendValue(value);
    
  }
);



bleMiddleware.startListening({
  actionCreator: startListeningParams, // New action for battery level
  effect: (_, listenerApi) => {
    
    readBatteryLevelFromDevice()
    bluetoothLeManager.startStreamingBatteryLevel((batteryValue) => {
      listenerApi.dispatch(setBatteryLevel(batteryValue));
    });

    readVelocityFromDevice()
    bluetoothLeManager.startStreamingVelocity((velocityValue) => {
      listenerApi.dispatch(setVelocity(velocityValue));
    });
    
    readLatitudeFromDevice()
    bluetoothLeManager.startStreamingLatitude((latitudeValue) => {
      listenerApi.dispatch(setLatitude(latitudeValue));
    });

    readLongitudeFromDevice()
    bluetoothLeManager.startStreamingLongitude((longitudeValue) => {
      listenerApi.dispatch(setLongitude(longitudeValue));
    });

  },
  
});


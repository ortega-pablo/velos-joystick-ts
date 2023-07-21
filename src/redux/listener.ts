import { createAsyncThunk, createListenerMiddleware } from "@reduxjs/toolkit";
import {
  setBatteryValue,
  setConnectedDevice,
  setDevice,
  startListening,
  startScanning,
} from "./slice";

import bluetoothLeManager, { DeviceReference } from "./BluetoothManager";

export const bleMiddleware = createListenerMiddleware();

export const connectToDevice = createAsyncThunk(
  "bleThunk/connectToDevice",
  async (ref: DeviceReference, thunkApi) => {
    if (ref.id) {
      await bluetoothLeManager.connectToPeripheral(ref.id);
      thunkApi.dispatch(setConnectedDevice(ref));
      bluetoothLeManager.stopScanningForPeripherals();
    }
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

bleMiddleware.startListening({
  actionCreator: startListening,
  effect: (_, listenerApi) => {
    bluetoothLeManager.startStreamingData(({ payload }) => {
      if (typeof payload === "string") {
        listenerApi.dispatch(setBatteryValue(payload));
      }
    });
  },
});

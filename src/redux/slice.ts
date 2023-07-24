import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import { DeviceReference } from "./BluetoothManager";

interface BluetoothState {
  allDevices: DeviceReference[];
  connectedDevice: DeviceReference | null;
  gamePadValue: string | null;
  velocityValue: string | null;
  batteryLevel: string | null;
  latitudeValue: string | null;
  longitudeValue: string | null;
}

const initialState: BluetoothState = {
  allDevices: [],
  connectedDevice: null,
  gamePadValue: null,
  velocityValue: null,
  batteryLevel: null,
  latitudeValue: null,
  longitudeValue: null,
};

const isDuplicateDevice = (
  devices: DeviceReference[],
  nextDevice: DeviceReference
) => devices.findIndex((device) => nextDevice.id === device.id) > -1;

export type DevicesAction = PayloadAction<DeviceReference>;

export const startScanning = createAction("bleState/startScanning");
export const startListening = createAction("bleState/startListening");
export const startListeningParams = createAction("bleState/startListeningParams");

export const bleState = createSlice({
  name: "bleState",
  initialState,
  reducers: {
    setDevice: (state, action: DevicesAction) => {
      if (!isDuplicateDevice(state.allDevices, action.payload)) {
        state.allDevices = [...state.allDevices, action.payload];
      }
    },
    setConnectedDevice: (state, action: PayloadAction<DeviceReference>) => {
      state.connectedDevice = action.payload;
    },
     setBatteryLevel: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.batteryLevel = action.payload;
    },
    setVelocity: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.velocityValue = action.payload;
    },
    setLatitude: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.latitudeValue = action.payload;
    },
    setLongitude: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.longitudeValue = action.payload;
    },
  },
});

export const { setDevice, setConnectedDevice, setBatteryLevel, setVelocity, setLatitude, setLongitude } = bleState.actions;

export default bleState.reducer;

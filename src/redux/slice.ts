import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import { DeviceReference } from "./BluetoothManager";

interface BluetoothState {
  allDevices: DeviceReference[];
  connectedDevice: DeviceReference | null;
  gamePadValue: string | null;
  velocityValue: string | null;
  batteryValue: string | null;
  latitudeValue: string | null;
  longitudeValue: string | null;
}

const initialState: BluetoothState = {
  allDevices: [],
  connectedDevice: null,
  gamePadValue: null,
  velocityValue: null,
  batteryValue: null,
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
     setBatteryValue: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.batteryValue = action.payload;
    },
  },
});

export const { setDevice, setConnectedDevice, setBatteryValue  } = bleState.actions;

export default bleState.reducer;

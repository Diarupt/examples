
import { Settings } from "react-feather";
import {
    IconButton, Dropdown,
} from "../components";
import { DeviceType, deviceTypeMap, AvailableDevices, SelectedDevices } from "../utils/useDevice";
import { FC } from "react";

interface DevicePickerProps {
    selectedDevices: SelectedDevices,
    availableDevices: AvailableDevices,
    selectDevice: (device: MediaDeviceInfo) => void
}
export const DevicePicker: FC<DevicePickerProps> = ({ selectedDevices, availableDevices, selectDevice }) => {

    return (
        <Dropdown
            trigger={
                <IconButton onClick={() => { }}>
                    <Settings className="h-5 w-5" />
                </IconButton>
            }
        >
            {
                Object.entries(availableDevices).map(([deviceType, devices]) =>
                    <div key={deviceType}>
                        <span className="w-fit px-4 py-2 text-slate-500 text-xs">
                            {deviceTypeMap[deviceType as DeviceType]}
                        </span>
                        {
                            devices.map((device) => {
                                return (
                                    <div
                                        key={device.deviceId}
                                        onClick={() => selectDevice(device)}
                                        className="w-full pl-8 pr-4 py-2 gap-6 capitalize text-sm hover:bg-slate-200 hover:cursor-pointer flex justify-between items-center">
                                        <span>
                                            {device.label}
                                        </span>
                                        <span className="text-xs">
                                            {device.deviceId === selectedDevices[deviceType as DeviceType]?.deviceId && ' ✔ '}
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </Dropdown>
    )
}
import { useState } from 'react';
export type DeviceType = 'audioinput' | 'audiooutput' | 'videoinput';

export type AvailableDevices = {
    audioinput: MediaDeviceInfo[];
    audiooutput: MediaDeviceInfo[];
    videoinput: MediaDeviceInfo[];
};

export type SelectedDevices = {
    audioinput: MediaDeviceInfo | null;
    audiooutput: MediaDeviceInfo | null;
    videoinput: MediaDeviceInfo | null;
};


export const deviceTypeMap = {
    audioinput: 'Microphone',
    audiooutput: 'Speaker',
    videoinput: 'Camera'
  }

export const useDevice = () => {
    const [error, setError] = useState<string | null>(null);
    const [selectedDevices, setSelectedDevices] = useState<SelectedDevices>({
        audioinput: null,
        audiooutput: null,
        videoinput: null,
    });
    const [availableDevices, setAvailableDevices] = useState<AvailableDevices>({
        audioinput: [],
        audiooutput: [],
        videoinput: [],
    });

    const getMediaDevices = async () => {
        const availableDevices: AvailableDevices = {
            audioinput: [],
            audiooutput: [],
            videoinput: [],
        };

        if (!navigator.mediaDevices?.enumerateDevices) {
            console.log('enumerateDevices() not supported.');
        } else {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                availableDevices.audioinput = [];
                availableDevices.audiooutput = [];
                availableDevices.videoinput = [];

                devices.forEach((device) => {
                    availableDevices[device.kind as keyof AvailableDevices].push(device);
                });
                setAvailableDevices(availableDevices);
            } catch (err: any) {
                // List cameras and microphones.
                console.error(`${err.name}: ${err.message}`);
                setError(`${err.name}: ${err.message}`);
            }
        }

        return availableDevices;
    };

    getMediaDevices()
        .then(async (availableDevices: AvailableDevices) => {
            const audioinput = availableDevices.audioinput[0];
            const audiooutput = availableDevices.audiooutput[0];
            const videoinput = availableDevices.videoinput[0];

            setSelectedDevices({
                audioinput,
                audiooutput,
                videoinput,
            });
        })
        .catch((err) => {
            console.log(err);
            setError(err.message);
        });
    
    const selectDevice = (device: MediaDeviceInfo) => setSelectedDevices(
        (prev) => ({
            ...prev,
            [device.kind]: device
        })
        )

    return {
        error,
        selectedDevices,
        availableDevices,
        selectDevice,
    };
};


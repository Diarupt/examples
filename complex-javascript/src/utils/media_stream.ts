type InitOptions = {
    video?: MediaTrackConstraints;
    audio?: MediaTrackConstraints;
    devices: {
        video: MediaDeviceInfo | null;
        audio: MediaDeviceInfo | null;
    };
};

let stream: MediaStream | null = null;

export const media = {
    init: async function ({ video, audio, devices }: InitOptions): Promise<MediaStream> {
        if (navigator.mediaDevices === undefined || navigator.mediaDevices.getUserMedia === undefined) {
            throw new Error('navigator.mediaDevices is undefined');
        } else {
            const mediaDevices = navigator.mediaDevices as any;
            stream = await mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false,
                    ...(devices.audio ? { deviceId: { exact: devices.audio.deviceId } } : {}),
                    ...(audio ?? {}),
                },
                video: video ?? {
                    width: 512,
                    height: 512,
                    ...(devices.video ? { deviceId: { exact: devices.video.deviceId } } : {}),
                    ...(video ?? {}),
                },
            });

            if (!stream) {
                throw new Error('No stream');
            }

            return stream;
        }
    },
};

import { AudioQuality, IOSOutputFormat, RecordingOptions } from "expo-audio";

const MONO = 1;
const BIT_RATE = 128000;

const CustomRCPreset: RecordingOptions = {
    isMeteringEnabled: true,
    numberOfChannels: MONO,
    bitRate: BIT_RATE,
    extension: ".m4a",
    sampleRate: 16000,

    android: {
        outputFormat: "mpeg4",
        audioEncoder: "aac",
    },
    ios: {
        outputFormat: IOSOutputFormat.MPEG4AAC,
        audioQuality: AudioQuality.MAX,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
    web: {
        mimeType: "audio/webm",
        bitsPerSecond: BIT_RATE,
    },
};

export default CustomRCPreset;

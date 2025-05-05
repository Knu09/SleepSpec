import {
    AndroidAudioEncoder,
    AndroidOutputFormat,
    IOSAudioQuality,
    IOSOutputFormat,
    RecordingOptions,
} from "expo-av/build/Audio";

const MONO = 1;
const BIT_RATE = 128000;

const CustomRCPreset: RecordingOptions = {
    isMeteringEnabled: true,
    android: {
        extension: ".m4a",
        outputFormat: AndroidOutputFormat.MPEG_4,
        audioEncoder: AndroidAudioEncoder.AAC,
        sampleRate: 44100,
        numberOfChannels: MONO,
        bitRate: BIT_RATE,
    },
    ios: {
        extension: ".m4a",
        outputFormat: IOSOutputFormat.MPEG4AAC,
        audioQuality: IOSAudioQuality.MAX,
        sampleRate: 44100,
        numberOfChannels: MONO,
        bitRate: BIT_RATE,
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

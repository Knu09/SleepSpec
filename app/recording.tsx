import { Link } from "expo-router";
import { useEffect, useReducer, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";

import Header from "@/components/Header";

const RecorderImage = require("@/assets/images/recording-button.png");
const FlagPH = require("@/assets/images/flag-ph.svg");

interface RecordingState {
    timer: number;
    isRecording: boolean;
}

enum RecordAction {
    START,
    STOP,
    INCREMENT_TIMER,
    RESET,
}

const recordReducer = (
    state: RecordingState,
    action: RecordAction,
): RecordingState => {
    switch (action) {
        case RecordAction.START:
            return { ...state, isRecording: true };

        case RecordAction.STOP:
            return { ...state, isRecording: false };

        case RecordAction.INCREMENT_TIMER:
            return { ...state, timer: state.timer + 1 };

        case RecordAction.RESET:
            return { ...state, timer: 0 };
    }
};

const initialRecordState: RecordingState = {
    timer: 0,
    isRecording: false,
};

export default function Recording() {
    const [recordState, dispatch] = useReducer(
        recordReducer,
        initialRecordState,
    );
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        // remove interval when component unmounts
        if (intervalRef.current != null) {
            return clearInterval(intervalRef.current);
        }
    }, []);

    function handleRecordStart() {
        if (!recordState.isRecording) {
            dispatch(RecordAction.START);
            const interval = setInterval(() => {
                dispatch(RecordAction.INCREMENT_TIMER);
            });

            intervalRef.current = interval;
        }
    }

    const text =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ex sem, cursus vel nisi at, laoreet eleifend urna. Suspendisse aliquam vehicula magna non ullamcorper. Fusce ut tincidunt nunc, sed egestas nisi. Donec placerat est a neque porttitor consequat. Suspendisse lacus mi, condimentum eu sollicitudin at, rutrum quis nisl. \n\nIn consectetur eu magna vel placerat. Proin tempor augue turpis, congue eleifend metus porttitor sed. Etiam varius ex ac orci fringilla rutrum. Etiam vel dui quis ante accumsan consequat at vitae metus. Donec vitae orci pretium, pellentesque velit ut, placerat ipsum. Nullam sagittis ligula sem, sit amet lobortis nibh aliquam ut. Cras sed risus rhoncus, pretium nisi ut, eleifend mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas eu nibh at metus viverra dapibus. Mauris bibendum rhoncus elit id sodales. Suspendisse nec odio elementum, cursus ligula vitae, hendrerit nisl. Suspendisse in urna pulvinar, interdum orci vitae, hendrerit nunc. Etiam eu est malesuada, sodales risus sit amet, ullamcorper nulla. ";
    return (
        <View className="bg-[#01000f]" style={{ flex: 1 }}>
            <Header title={"Recording"} back={true} menu={true} />
            <View className="px-[26px] py-8 gap-2">
                <Text className="text-lg text-white font-medium">Language</Text>
                <Link href="/recording">
                    <View className="flex flex-row text gap-[9px] pl-[2px]">
                        <Image
                            source={FlagPH}
                            style={{ width: 25, aspectRatio: 1 }}
                        />
                        <Text className="text-lg text-white font-normal">
                            Filipino
                        </Text>
                    </View>
                </Link>
            </View>
            <Text
                className="mx-8 h-[350px] text-lg leading-6 overflow-y-hidden
                text-[#ddd] font-light border-2 rounded-lg border-blue-800 p-2"
            >
                {text}
            </Text>

            <Text className="text-white mx-auto mt-10 text-3xl">
                {formatTime(recordState.timer)}
            </Text>
            <Pressable onPress={handleRecordStart}>
                <Image
                    source={RecorderImage}
                    style={{
                        width: 200,
                        aspectRatio: 1,
                        marginInline: "auto",
                        marginBlock: 18,
                    }}
                />
            </Pressable>
            <Text className="text-[#006fff] text-[24px] text-3xl font-medium mx-auto">
                {recordState.isRecording ? "Speak Now" : "Press to Record"}
            </Text>
        </View>
    );
}

function formatTime(millis: number): string {
    const m = millis / 100;
    const seconds = Math.floor(m % 60);
    const minutes = Math.floor(m / 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    const formattedMilliseconds = String(Math.floor(millis % 100)).padStart(
        2,
        "0",
    );

    return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

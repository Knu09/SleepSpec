import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Recording() {
    const [time, setTime] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTime((prev) => prev + 1), 1);

        return () => clearInterval(interval);
    }, []);

    const text =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ex sem, cursus vel nisi at, laoreet eleifend urna. Suspendisse aliquam vehicula magna non ullamcorper. Fusce ut tincidunt nunc, sed egestas nisi. Donec placerat est a neque porttitor consequat. Suspendisse lacus mi, condimentum eu sollicitudin at, rutrum quis nisl. \n\nIn consectetur eu magna vel placerat. Proin tempor augue turpis, congue eleifend metus porttitor sed. Etiam varius ex ac orci fringilla rutrum. Etiam vel dui quis ante accumsan consequat at vitae metus. Donec vitae orci pretium, pellentesque velit ut, placerat ipsum. Nullam sagittis ligula sem, sit amet lobortis nibh aliquam ut. Cras sed risus rhoncus, pretium nisi ut, eleifend mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas eu nibh at metus viverra dapibus. Mauris bibendum rhoncus elit id sodales. Suspendisse nec odio elementum, cursus ligula vitae, hendrerit nisl. Suspendisse in urna pulvinar, interdum orci vitae, hendrerit nunc. Etiam eu est malesuada, sodales risus sit amet, ullamcorper nulla. ";
    return (
        <View className="bg-[#01000f] flex-grow">
            <Text
                className=" mx-8 h-[350px] text-lg leading-6 overflow-y-hidden mt-44 
                    text-[#ddd] font-light border-2 rounded-lg border-blue-800 p-2"
            >
                {text}
            </Text>

            <Text className="text-white mx-auto font-semibold mt-10 text-4xl">
                {formatTime(time)}
            </Text>
            <Text className="text-[#006fff] text-3xl font-medium mx-auto mt-12">
                Speak Now
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

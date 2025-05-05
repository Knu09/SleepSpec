import { SafeAreaView, ScrollView, View, Text } from "react-native";
import Header from "@/components/Header";

export default function() {
    return (
        <SafeAreaView className="flex-1 bg-darkBg">
            <Header title={"Feature Analysis"} back={true} menu={true} />
            <ScrollView
                className="mt-10 px-6"
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
            >
                <View className="flex justify-center items-center text-center text-secondary">
                    <Text className="text-secondary">You are</Text>
                    <Text className="text-danger font-publicsans text-2xl font-bold">
                        Highly Sleep-deprived!
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

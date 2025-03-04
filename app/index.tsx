<<<<<<< HEAD
import { Text, View } from "react-native";
import "../global.css"
=======
import { Route } from "expo-router/build/Route";
import {
    StyleSheet,
    View,
    ScrollView,
    Button,
    SafeAreaView,
    Text,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

// import { COLORS, icons, images, SIZES } from '../contants';
>>>>>>> 25db753 (update home page and reinstall android)

export default function Index() {
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flex: 1,
                }}
            >
                {/* <MaskedView */}
                {/*     maskElement={<Text style={styles.title}>SleepSpec.</Text>} */}
                {/* > */}
                {/*     <LinearGradient */}
                {/*         colors={["#006EFF", "#7800D3"]} */}
                {/*         style={styles.gradient} */}
                {/*     /> */}
                {/* </MaskedView> */}
                <Text style={styles.title}>SleepSpec.</Text>
                <Text style={styles.subtitle}>
                    Sleep Deprivation Detection using SVM
                </Text>
            </View>
            <View>
                <Text>Start </Text>
                {/* <Button> */}
                {/*     <View> */}
                {/*         <Text>Select language</Text> */}
                {/*         <Text> */}
                {/*         </Text> */}
                {/*     </View> */}
                {/* </Button> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#01000F",
        alignItems: "center",
    },

    title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },

    subtitle: {
        fontSize: 38,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },

    gradient: { flex: 1 },
});

import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectLanguage() {
    return (
        <SafeAreaView>
            <Header title="Select Language" back={true} menu={true} />
        </SafeAreaView>
    );
}

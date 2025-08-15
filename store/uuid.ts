import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from 'expo-crypto';

const getUUID = async () => {
    const uuid = await AsyncStorage.getItem("UUID");

    if (uuid !== null) {
        return uuid;
    }

    const newUID = Crypto.randomUUID();
    await AsyncStorage.setItem("UUID", newUID);

    return newUID;
};

export default getUUID;

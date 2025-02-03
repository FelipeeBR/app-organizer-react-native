import { Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Items() {
    return (
        <View className="w-full flex items-end px-4 mb-5 mt-2">
            <View className="flex-row gap-2">
                <TouchableOpacity className="w-10 h-10 flex items-center justify-center">
                    <FontAwesome name="bell" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 rounded-full border flex items-center justify-center border-white bg-slate-700">
                    <FontAwesome6 name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
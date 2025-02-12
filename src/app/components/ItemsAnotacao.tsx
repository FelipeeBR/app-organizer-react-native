import { TouchableOpacity, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

export default function ItemsAnotacao() {
    const router = useRouter();

    return (
        <View className="w-full flex bg-gray-200 items-end px-4 mb-5 mt-2">
            <View className="flex-row gap-2">
                <TouchableOpacity className="w-10 h-10 flex items-center justify-center">
                    <FontAwesome5 name="bell" size={24} color="#334155" />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> router.push(`/anotacao/create`)} className="w-10 h-10 rounded-full border flex items-center justify-center border-white bg-slate-700">
                    <FontAwesome6 name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
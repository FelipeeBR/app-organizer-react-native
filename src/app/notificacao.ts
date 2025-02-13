import axios from "axios";
import * as SecureStore from "expo-secure-store";

async function fetchNotificacoes()  {
    try {
        const token = await SecureStore.getItemAsync("authToken");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/notificacoes/verificar`, {
            headers: {
                Authorization: `Bearer ${String(token)}`,
            },
        });
        return response.data;
    } catch (error) {
    }
}

async function getNotificacoes()  {
    try {
        const token = await SecureStore.getItemAsync("authToken");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/notificacoes`, {
            headers: {
                Authorization: `Bearer ${String(token)}`,
            },
        });
        return response.data;
    } catch (error) {
    }
}

export { fetchNotificacoes, getNotificacoes }
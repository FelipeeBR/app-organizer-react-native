import { create } from "zustand";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface Notificacao {
    id: number;
    descricao: string;
    lida: boolean;
}

interface NotificacaoStore {
    notificacoes: Notificacao[];
    adicionarNotificacao: (notificacao: Notificacao) => void;
    removerNotificacao: (id: number) => void;
    carregarNotificacoes: () => Promise<Notificacao[]>;
}

const useNotificacaoStore = create<NotificacaoStore>((set, get) => ({
    notificacoes: [],
    
    carregarNotificacoes: async () => {
        try {
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.get<Notificacao[]>(`${process.env.EXPO_PUBLIC_API_URL}/notificacoes`, {
                headers: {
                    Authorization: `Bearer ${String(token)}`,
                },
            });

            const novasNotificacoes = response.data.filter(
                (nova) => !get().notificacoes.some((existente) => existente.id === nova.id)
            );

            set({ notificacoes: [...get().notificacoes, ...novasNotificacoes] });

            return response.data;
        } catch (error) {
            return [];
        }
    },

    adicionarNotificacao: (notificacao) => set((state) => ({
        notificacoes: state.notificacoes.some((n) => n.id === notificacao.id)
            ? state.notificacoes 
            : [...state.notificacoes, notificacao], 
    })),

    removerNotificacao: (id) => set((state) => ({
        notificacoes: state.notificacoes.filter((notificacao) => notificacao.id !== id),
    })),
}));

export default useNotificacaoStore;

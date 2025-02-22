import { create } from "zustand";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface ITarefa {
    id: number;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    description: string;
    priority: string;
    title: string;
}

interface TarefaStore {
    tarefasHome: ITarefa[];
    adicionarTarefa: (tarefa: ITarefa) => void;
    adicionarTarefas: (tarefas: ITarefa[]) => void;
    removerTarefa: (id: number) => void;
    atualizarDados: () => Promise<void>;
}

const useTarefaStore = create<TarefaStore>((set) => ({
    tarefasHome: [],

    adicionarTarefa: (tarefa) =>
        set((state) => {
            const tarefasAtualizadas = state.tarefasHome.filter(t => t.id !== tarefa.id);
            return { tarefasHome: [...tarefasAtualizadas, tarefa] };
        }),

    adicionarTarefas: (tarefas) =>
        set(() => ({
            tarefasHome: [...tarefas]
        })),
    
    removerTarefa: (id: number) =>
        set((state) => ({
            tarefasHome: state.tarefasHome.filter(t => t.id !== id)
        })),

    atualizarDados: async () => {
        try {
            const tokenData = await SecureStore.getItemAsync("authToken");
            if (!tokenData) {
                console.error("Token não encontrado");
                return;
            }
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/tarefasUser`, {
                headers: {
                    Authorization: `Bearer ${String(tokenData)}`,
                    "Content-Type": "application/json",
                },
            });

            set(() => ({ tarefasHome: response.data }));
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    }
}));

export default useTarefaStore;

import { create } from "zustand";

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
}));


export default useTarefaStore;

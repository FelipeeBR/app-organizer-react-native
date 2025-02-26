import React, { useState, useEffect, useCallback } from "react";
import { BoardRepository } from '@felipemen74/react-native-draganddrop-board';
import { Board } from '@felipemen74/react-native-draganddrop-board';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import Tarefa from "../components/Tarefa";
import { Alert, View } from "react-native";
import ItemsHome from "../components/ItemsHome";
import useTarefaStore from "../useTarefaStore";
import useNotificacaoStore from "../useNotificacaoStore";
import { useFocusEffect } from "@react-navigation/native";

interface ITarefa {
  id: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  description: string;
  priority: string;
  title: string;
}

export default function Home() {
    const { tarefasHome, adicionarTarefa, adicionarTarefas, atualizarDados } = useTarefaStore();
    const { carregarNotificacoes } = useNotificacaoStore();

    const [selectedItem, setSelectedItem] = useState(null);
    const [tarefas, setTarefas] = useState<any[]>([
        {
            id: 1,
            name: 'Pendente⛔',
            rows: []
        },
        {
            id: 2,
            name: 'Fazendo⏳',
            rows: []
        },
        {
            id: 3,
            name: 'Concluído✅',
            rows: []
        }
    ]);
    const [listTarefas, setListTarefas] = useState<ITarefa[]>([]);
    const boardRepository = new BoardRepository(tarefas);

    useEffect(() => {
        carregarNotificacoes();
    }, []);

    useEffect(() => {
        const fetchTarefas = async () => {
            try {
                const tokenData = await SecureStore.getItemAsync("authToken");
                if(!tokenData) {
                    console.error('Token não encontrado');
                    return;
                }
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/tarefasUser`, {
                    headers: {
                        Authorization: `Bearer ${String(tokenData)}`,
                        "Content-Type": "application/json",
                    }
                });
                setListTarefas(response.data);
                adicionarTarefas(response.data);
            } catch(error: any) {
                console.error('Erro ao buscar tarefas:', error.response.data);
            }
        };
        fetchTarefas();
    }, []);

    useEffect(() => {
        if(tarefasHome.length > 0) {
            const updatedTarefas = tarefas.map((tarefa) => {
                let filteredRows: ITarefa[] = [];
    
                switch (tarefa.id) {
                    case 1:
                        filteredRows = tarefasHome.filter((t) => t.status === "PENDING");
                        break;
                    case 2:
                        filteredRows = tarefasHome.filter((t) => t.status === "IN_PROGRESS");
                        break;
                    case 3:
                        filteredRows = tarefasHome.filter((t) => t.status === "COMPLETED");
                        break;
                    default:
                        filteredRows = [];
                }
    
                return {
                    ...tarefa,
                    rows: filteredRows,
                };
            });
    
            setTarefas(updatedTarefas);
        }else{
            const updatedTarefas = tarefas.map((tarefa) => {
                let filteredRows: ITarefa[] = [];
    
                switch (tarefa.id) {
                    case 1:
                        filteredRows = tarefasHome.filter((t) => t.status === "PENDING");
                        break;
                    case 2:
                        filteredRows = tarefasHome.filter((t) => t.status === "IN_PROGRESS");
                        break;
                    case 3:
                        filteredRows = tarefasHome.filter((t) => t.status === "COMPLETED");
                        break;
                    default:
                        filteredRows = [];
                }
    
                return {
                    ...tarefa,
                    rows: filteredRows,
                };
            });
    
            setTarefas(updatedTarefas);
        }
    }, [tarefasHome]);

    const updateTarefaStatus = async (id: number, status: string) => {
        const tarefa = listTarefas.find((task) => task.id === id);
        if (!tarefa) return;
    
        const tarefaAtualizada = { ...tarefa, status: status as "PENDING" | "IN_PROGRESS" | "COMPLETED" };
    
        const token = await SecureStore.getItemAsync("authToken");
        if (!token) {
            console.error('Token não encontrado');
            return;
        }
    
        try {
            await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/tarefa/${id}`, tarefaAtualizada, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            adicionarTarefa(tarefaAtualizada);
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    };
        

    const handleDragEnd = async (srcColumn: any, destColumn: any, draggedItem: any) => {
        console.log("Eventos: ", srcColumn, destColumn, draggedItem.attributes.id);

        if(srcColumn !== destColumn) {
            let newStatus = "";
            switch (destColumn) {
                case 1:
                    newStatus = "PENDING";
                    break;
                case 2:
                    newStatus = "IN_PROGRESS";
                    break;
                case 3:
                    newStatus = "COMPLETED";
                    break;
                default:
                    newStatus = "PENDING";
            }
            await updateTarefaStatus(draggedItem.attributes.id, newStatus);
        }
    };

    const fetchDados = async () => {
        try {
            const tokenData = await SecureStore.getItemAsync("authToken");
            if(!tokenData) {
                console.error('Token não encontrado');
                return;
            }
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/tarefasUser`, {
                headers: {
                    Authorization: `Bearer ${String(tokenData)}`,
                    "Content-Type": "application/json",
                }
            });
            setListTarefas(response.data);
        } catch(error: any) {
            return;
        }
    };

    const handleOpen = (item:any) => {
        setSelectedItem(item);
        Alert.alert(item.title, item.description, [
            { text: 'OK' },
        ]);
    };

    useFocusEffect(
        useCallback(() => {
            fetchDados();
            atualizarDados();
        }, [atualizarDados])
    );
    
    return (
        <View className="bg-gray-200">
            <ItemsHome fetchDados={fetchDados}/>
            <Board
                boardRepository={boardRepository}
                open={handleOpen}
                onDragEnd={handleDragEnd}
                isWithCountBadge={false}
                cardContent={(task: any) => (<Tarefa key={task.id} task={task} fetchDados={fetchDados} />)}
            />
        </View>
    );
}
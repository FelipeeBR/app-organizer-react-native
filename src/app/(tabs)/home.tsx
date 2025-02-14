import React, { useState, useEffect } from "react";
import { BoardRepository } from '@felipemen74/react-native-draganddrop-board';
import { Board } from '@felipemen74/react-native-draganddrop-board';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import Tarefa from "../components/Tarefa";
import { Alert, View } from "react-native";
import ItemsHome from "../components/ItemsHome";

interface ITarefa {
  id: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  description: string;
  priority: string;
  title: string;
}

export default function Home() {
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
            } catch(error: any) {
                console.error('Erro ao buscar tarefas:', error.response.data);
            }
        };
        fetchTarefas();
    }, []);

    useEffect(() => {
        if(listTarefas.length > 0) {
            const updatedTarefas = tarefas.map(tarefa => {
                let filteredRows = Array<any>();
                switch (tarefa.id) {
                    case 1:
                        filteredRows = listTarefas.filter(t => t.status === "PENDING");
                        break;
                    case 2:
                        filteredRows = listTarefas.filter(t => t.status === "IN_PROGRESS");
                        break;
                    case 3:
                        filteredRows = listTarefas.filter(t => t.status === "COMPLETED");
                        break;
                    default:
                        filteredRows = [];
                }
                return {
                    ...tarefa,
                    rows: filteredRows
                };
            });
            setTarefas(updatedTarefas);
        }
    }, [listTarefas]);

    const updateTarefaStatus = async (id: number, status: any) => {
        const tarefa = { ...listTarefas.find((task) => task.id === id), status };
        const token = await SecureStore.getItemAsync("authToken");
        if(!token) {
            console.error('Token não encontrado');
            return;
        }
        try {
            const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/tarefa/${id}`, {
                ...tarefa
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            atualizarDados();
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }

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

    const atualizarDados = async () => {
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
            console.error('Erro ao buscar tarefas:', error.response.data);
        }
    };

    const handleOpen = (item:any) => {
        setSelectedItem(item);
        Alert.alert(item.title, item.description, [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
    };
    
    return (
        <View className="bg-gray-200">
            <ItemsHome atualizarDados={atualizarDados}/>
            <Board
                boardRepository={boardRepository}
                open={handleOpen}
                onDragEnd={handleDragEnd}
                isWithCountBadge={false}
                cardContent={(task: any) => (<Tarefa key={task.id} task={task} atualizarDados={atualizarDados} />)}
            />
        </View>
    );
}
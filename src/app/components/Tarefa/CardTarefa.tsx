import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { format, addDays } from 'date-fns';

export default function CardTarefa({ tarefa }: any) {
    const { id, title, description, date, priority, status } = tarefa;

    const getStatusColor = (status: any) => {
        switch (status) {
          case 'PENDING':
            return 'bg-red-500'; 
          case 'COMPLETED':
            return 'bg-green-500'; 
          case 'IN_PROGRESS':
            return 'bg-blue-500'; 
          default:
            return 'bg-gray-500';
        }
    };

    const getPriorityColor = (priority: any) => {
        switch (priority) {
          case 'ALTA':
            return 'bg-red-500'; 
          case 'MEDIA':
            return 'bg-yellow-500'; 
          case 'BAIXA':
            return 'bg-green-500'; 
          default:
            return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: any) => {
        switch (status) {
            case 'PENDING':
                return (
                    <View className='flex items-center gap-2'>
                        <FontAwesome6 name="circle-xmark" color="white" size={20}/>
                        <Text>Pendente</Text>
                    </View>
                ); 
            case 'IN_PROGRESS':
                return (
                    <View className='flex items-center gap-2'>
                        <FontAwesome5 name="hourglass-end" color="white" size={20}/>
                        <Text>Fazendo</Text>
                    </View>
                ); 
            case 'COMPLETED':
                return (
                    <View className='flex items-center gap-2'>
                        <FontAwesome5 name="check-double" color="white" size={20}/>
                        <Text>Concluída</Text>
                    </View>
                ); 
            default:
                return <FontAwesome5 name="tasks" color="white" size={20}/>;
        }
    };

    return (
        <View className="bg-white rounded-lg shadow-md flex flex-col justify-between border border-slate-300 p-4">
            <View className="flex flex-col items-center justify-between mb-4">
                <View className={`rounded-lg text-white text-sm font-semibold px-2 py-1 flex items-center gap-2 capitalize ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                </View>
                <View className={`rounded-lg text-white text-sm font-semibold px-4 py-1 w-40 text-center capitalize m-1 ${getPriorityColor(priority)}`}>
                    <Text>Prioridade: {priority}</Text>
                </View>
                <View>
                    <View className="flex items-center gap-2">
                        <FontAwesome5 name="calendar" color="#334155" size={20}/>
                        <Text className="text-sm text-gray-600">Prazo: {format(addDays(new Date(date), 1), 'dd/MM/yyyy')}</Text>
                    </View>
                </View>
            </View>
            <View className="flex-grow">
                <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
                <Text className="text-sm text-gray-600">{description}</Text>
            </View>
            <View className="flex items-start">
                <View className="mt-4 flex-row gap-2 sm:mt-auto">
                    <TouchableOpacity className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg">
                        <FontAwesome5 name="edit" size={16} color="white"/>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg">
                        <FontAwesome5 name="trash" size={16} color="white"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
import React, {useEffect, useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import CardAgenda from '../components/CardAgenda';
import ItemsAgenda from '../components/ItemsAgenda';
import { format } from 'date-fns';

LocaleConfig.locales['pt'] = {
monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',  
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
],
monthNamesShort: [
    'Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.',  
    'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'
],
dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',  
    'Quinta-feira', 'Sexta-feira', 'Sábado'
],
dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
today: 'Hoje'
};

LocaleConfig.defaultLocale = 'pt';

type AgendaItem = {
    id: string;
    date: string;
    description: string;
};

type CustomMarkedDate = {
    customStyles: {
      container: {
        backgroundColor: string;
        borderRadius: number;
      };
      text: {
        color: string;
        fontWeight: string;
      };
    };
    agendas: AgendaItem[];
};
  
type MarkedDateType = {
    [date: string]: CustomMarkedDate;
};

export default function Agenda() {
    const [selected, setSelected] = useState('');
    const [agendas, setAgendas] = useState<any[]>([]);
    const [markedDates, setMarkedDates] = useState<MarkedDateType>({});
    const [loading, setLoading] = useState(true);

    const atualizarDados = async () => {
        try {
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.get<AgendaItem[]>(`${process.env.EXPO_PUBLIC_API_URL}/agendas`, {
                headers: {
                    Authorization: `Bearer ${String(token)}`,
                },
            });
            setAgendas(response.data);
            setLoading(false);
            
            const datesMap = new Map<string, AgendaItem[]>();
            
            response.data.forEach((agenda) => {
                const date = agenda.date.split('T')[0];
                if (!datesMap.has(date)) {
                    datesMap.set(date, []);
                }
                datesMap.get(date)?.push(agenda);
            });
            
            const formattedDates: MarkedDateType = {};
            
            datesMap.forEach((agendasForDate, date) => {
                formattedDates[date] = {
                    customStyles: {
                        container: {
                            backgroundColor: 'blue',
                            borderRadius: 10,
                        },
                        text: {
                            color: 'white',
                            fontWeight: 'bold',
                        },
                    },
                    agendas: agendasForDate,
                };
            });
            
            setMarkedDates(formattedDates);
        } catch (error) {
            setAgendas([]);
            setLoading(false);
            return;
        }
    };

    useEffect(() => {
        atualizarDados();
    }, []); 

    const showAgendasForDate = (dateString: string) => {
        if (markedDates[dateString] && markedDates[dateString].agendas) {
            const agendasForDate = markedDates[dateString].agendas;
            
            if (agendasForDate.length === 1) {
                Alert.alert("Sobre", agendasForDate[0].description);
            } else {
                const message = agendasForDate.map((agenda, index) => 
                    `${index + 1}. ${agenda.description}\n`
                ).join('\n');
                
                Alert.alert(
                    `Agendas em ${format(new Date(dateString), 'dd/MM/yyyy')}`,
                    message,
                    [
                        { text: "OK" }
                    ]
                );
            }
        }
    };

    return (
        <View className="bg-gray-200">
            <View>
                <ItemsAgenda atualizarDados={atualizarDados}/>
            </View>
            <View className='flex m-3 rounded-lg'>
                <Calendar
                    onDayPress={(day: any) => {
                        setSelected(day.dateString);
                        showAgendasForDate(day.dateString);
                    }}
                    markingType="custom"
                    markedDates={{
                        ...markedDates,
                        [selected]: { 
                            selected: true, 
                            disableTouchEvent: true, 
                            selectedDotColor: 'blue', 
                            selectedColor: 'blue', 
                            dotColor: 'blue', 
                            marked: true 
                        },
                    }}
                />
            </View>
            <ScrollView className="flex-1 p-4 min-h-[70%] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : agendas && agendas.length > 0 ? (
                    agendas.map((agenda: any) => <CardAgenda key={agenda.id} info={agenda} atualizarDados={atualizarDados} />)
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-lg">Nenhuma agenda encontrada</Text> 
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
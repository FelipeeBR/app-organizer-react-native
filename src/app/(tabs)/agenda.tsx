import React, {useEffect, useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import CardAgenda from '../components/CardAgenda';
import ItemsAgenda from '../components/ItemsAgenda';

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

export default function Agenda() {
    const [selected, setSelected] = useState('');
    const [agendas, setAgendas] = useState<any[]>([]);
    const [markedDates, setMarkedDates] = useState({});
    const [loading, setLoading] = useState(true);

    const atualizarDados = async () => {
        try {
          const token = await SecureStore.getItemAsync("authToken");
          const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/agendas`, {
            headers: {
              Authorization: `Bearer ${String(token)}`,
            },
          });
          setAgendas(response.data);
          setLoading(false);
          const formattedDates = response.data.reduce((acc: any, agenda: any) => {
              const date = agenda.date.split('T')[0]; 
              acc[date] = { marked: true, dotColor: 'red' }; 
              return acc;
          }, {});

          setMarkedDates(formattedDates);
        } catch (error) {
            setAgendas([]);
            setLoading(false);
          return;
        }
      };

    useEffect(() => {
        atualizarDados();
    }, [agendas]);

    return (
        <View className="bg-gray-200">
            <View>
                <ItemsAgenda atualizarDados={atualizarDados}/>
            </View>
            <View className='flex m-3 rounded-lg'>
                <Calendar
                    onDayPress={(day: any) => {
                        setSelected(day.dateString);
                    }}
                    markedDates={{
                        ...markedDates,
                        [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'blue', selectedColor: 'blue', dotColor: 'blue', marked: true },
                    }}
                />
            </View>
            <ScrollView className="flex-1 p-4 min-h-[90%] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
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
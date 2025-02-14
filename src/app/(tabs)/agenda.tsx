import React, {useEffect, useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { View, Text, ScrollView } from 'react-native';
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
    const [agendas, setAgendas] = useState([]);
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        const fetchAgendas = async () => {
          try {
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/agendas`, {
              headers: {
                Authorization: `Bearer ${String(token)}`,
              },
            });
            setAgendas(response.data);
            const formattedDates = response.data.reduce((acc: any, agenda: any) => {
                const date = agenda.date.split('T')[0]; 
                acc[date] = { marked: true, dotColor: 'red' }; 
                return acc;
            }, {});

            setMarkedDates(formattedDates);
          } catch (error) {
            console.error('Erro ao buscar agendas:', error);
          }
        };
        fetchAgendas();
    }, [agendas]);

    return (
        <View className="bg-gray-200">
            <View>
                <ItemsAgenda/>
            </View>
            <Calendar
                onDayPress={(day: any) => {
                    setSelected(day.dateString);
                }}
                markedDates={{
                    ...markedDates,
                    [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'blue', selectedColor: 'blue', dotColor: 'white', marked: true },
                }}
            />
            <ScrollView className="flex-1 p-4 min-h-[90%] bg-gray-200" contentContainerStyle={{ paddingBottom: 50 }}>
                {agendas.map((agenda: any) => (
                    <CardAgenda key={agenda.id} info={agenda} />
                ))}
            </ScrollView>
        </View>
    );
}
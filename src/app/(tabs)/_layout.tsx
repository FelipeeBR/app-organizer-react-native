import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#1F2937' }}>
            <Tabs.Screen
                name="home"
                options={{
                title: 'Início',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="disciplina"
                options={{
                title: 'Disciplinas',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="book-open" color={color} />,
                }}
            />
            <Tabs.Screen
                name="anotacao"
                options={{
                title: 'Anotações',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
                }}
            />
            <Tabs.Screen
                name="concluido"
                options={{
                title: 'Concluídos',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="check" color={color} />,
                }}
            />
            <Tabs.Screen
                name="agenda"
                options={{
                    title: 'Agenda',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar-alt" color={color} />,
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                title: 'Perfil',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="user-alt" color={color} />,
                }}
            />
        </Tabs> 
    );
}

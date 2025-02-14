import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as Notifications from 'expo-notifications';

async function fetchNotificacoes()  {
    try {
        const token = await SecureStore.getItemAsync("authToken");
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notificacoes/verificar`, {
            headers: {
                Authorization: `Bearer ${String(token)}`,
            },
        });
        return response.data;
    } catch (error) {
    }
}

async function getNotificacoes()  {
    try {
        const token = await SecureStore.getItemAsync("authToken");
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notificacoes`, {
            headers: {
                Authorization: `Bearer ${String(token)}`,
            },
        });
        return response.data;
    } catch (error) {
    }
}

/*async function scheduleLocalNotification(descricao: string, triggerSeconds: number) {
  console.log(triggerSeconds);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Nova Notificação",
      body: descricao,
    },
    trigger: {
      day: 13,
      hour: 21,
      minute: 22,
      month: 2,
      type: Notifications.SchedulableTriggerInputTypes.YEARLY
    },
  });
  console.log("Notificação :", descricao);
}

scheduleLocalNotification("Descrição da notificação", 10);

function calculateTriggerSeconds(dataEnvio: string): number {
  const dataNotificacao = new Date(dataEnvio); 
  const dataAtual = new Date(); 
  const diferencaSegundos = Math.floor((dataNotificacao.getTime() - dataAtual.getTime()) / 1000);

  return diferencaSegundos > 0 ? diferencaSegundos : 1;
}

async function marcarNotificacaoComoAgendada(id: number): Promise<boolean> {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    const response = await axios.put(
      `${process.env.EXPO_PUBLIC_API_URL}/notificacaoapp/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${String(token)}`,
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error("Erro ao marcar notificação como agendada:", error);
    return false;
  }
}

async function fetchAndScheduleNotifications() {
  try {
    const notificacoes = await getNotificacoes();

    if (notificacoes && notificacoes.length > 0) {
      for (const notificacao of notificacoes) {
        if (!notificacao.agendada && !notificacao.lida) {
          const triggerSeconds = calculateTriggerSeconds(notificacao.dataEnvio);
          try {
            await scheduleLocalNotification(notificacao.descricao, triggerSeconds);
            console.log(`Notificação agendada: ${notificacao.descricao}`);

            const marcadaComSucesso = await marcarNotificacaoComoAgendada(notificacao.id);
            if (!marcadaComSucesso) {
              console.error("Falha ao marcar notificação como agendada no backend.");
            }
          } catch (error) {
            console.error("Erro ao agendar notificação local:", error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
  }
}*/

export { fetchNotificacoes, getNotificacoes };
import { setHours, setMinutes, format, addMinutes, isToday, isBefore } from "date-fns";

export function generateDayTimeList(date: Date): string[] {
  // Configurações de horário de funcionamento
  const startTime = setMinutes(setHours(date, 9), 0); // Início às 09:00
  const endTime = setMinutes(setHours(date, 21), 0); // Término às 21:00
  const interval = 45; // Intervalo em minutos
  const timeList: string[] = [];
  
  let currentTime = startTime;
  const now = new Date();
  
  // Verifica se a data selecionada é hoje
  const isDateToday = isToday(date);
  
  while (currentTime <= endTime) {
    // Se for hoje, só inclui horários futuros (com uma margem de 15 minutos)
    const minimumTime = addMinutes(now, 15); // Adiciona 15 minutos ao horário atual como margem
    
    // Só adiciona o horário se:
    // 1. Não for hoje, OU
    // 2. For hoje, mas o horário ainda não passou (considerando a margem)
    if (!isDateToday || !isBefore(currentTime, minimumTime)) {
      timeList.push(format(currentTime, "HH:mm"));
    }
    
    currentTime = addMinutes(currentTime, interval);
  }
  
  return timeList;
}
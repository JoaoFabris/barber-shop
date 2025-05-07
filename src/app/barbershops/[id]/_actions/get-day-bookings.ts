'use server';

//Indica que este módulo/função só pode rodar no servidor (Node.js), NUNCA será enviado para o client.
// Isso permite usar coisas como Prisma, variáveis secretas e acesso ao banco de dados com segurança.
// Garante que essa função nunca será bundleada para o browser.

import { db } from "@/app/_lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export const getDayBookings = async (barbershopId: string, date: Date) => {
    const bookings = await db.booking.findMany({
        // aqui eu pego as reservas do dia filtrando pelo dia
        // e não pela data completa, pois a data completa tem hora e minuto nela contem os horarios de reserva
        where: {
            barbershopId,
            date: {
                gte: startOfDay(date),
                lte: endOfDay(date),
            },
        },
    })
    return bookings;
}

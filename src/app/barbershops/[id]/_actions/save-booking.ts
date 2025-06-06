'use server'

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveBookingParams {
    barbershopId: string;
    serviceId: string;
    userId: string;
    date: Date;
}

export const saveBooking = async (params: SaveBookingParams) => {
    await db.booking.create({
        data: {
            barbershopId: params.barbershopId,
            serviceId: params.serviceId,
            userId: params.userId,
            date: params.date,
        },
    });
    revalidatePath("/") // se tiver na pag home ele vai revalidar dentro da pag home
    revalidatePath("/bookings") // se tiver na pag booking ele vai revalidar dentro da pag booking
}
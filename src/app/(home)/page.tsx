import { db } from "../_lib/prisma"; // criado apartir da prisma chamando o bd
import { ptBR } from "date-fns/locale/pt-BR";
import { format } from "date-fns";
import { Barbershop } from "@/generated/prisma";
import Header from "../_components/header";
import Search from "./_components/search";
import BarbershopItem from "./_components/barbershop-item";
import { getServerSession } from "next-auth";
import BookingItem from "../_components/booking-item";
import { authOptions } from "../_lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  // o promise.all executa paralelamente o barbershops e confirmedBookings
  const [barbershops, confirmedBookingsRaw] = await Promise.all([
    db.barbershop.findMany({}),
    session
      ? await db.booking.findMany({
          where: {
            userId: (session.user as { id: string }).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const confirmedBookings = confirmedBookingsRaw.map((booking) => ({
    ...booking,
    service: {
      ...booking.service,
      price: booking.service.price.toNumber(),
    },
  }));

  const shuffledBarbershops = [...barbershops].sort(() => Math.random() - 0.5);
  
   const popularBarbershops = [...barbershops]
    .sort((a, b) => {
      // Ordenar primeiro por média de avaliação (decrescente)
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      
      // Se as médias forem iguais, ordenar por quantidade de avaliações (decrescente)
      return b.averageRating - a.averageRating;
    })

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          {session?.user ? ` Olá ${session.user.name} ` : "Faça o login"}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>
      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">
        {confirmedBookings.length > 0 ? (
          <>
            <h2 className="text-sm mb-3 uppercase text-grey-400 font-bold">
              Agendamentos
            </h2>
            <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        ) : (
          <h2 className="text-sm mb-3 uppercase text-grey-400 font-bold">
            Nenhum agendamento
          </h2>
        )}
      </div>
      <div className="mt-6">
        <h2 className="px-5 text-sm mb-3 uppercase text-gray-400 font-bold">
          Recomendações
        </h2>
        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {shuffledBarbershops.map((barbershop: Barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-sm mb-3 uppercase text-gray-400 font-bold">
          Populares
        </h2>
        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop: Barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

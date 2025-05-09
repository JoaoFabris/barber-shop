import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";

export default async function BookingPage () {
  // recuperar a sessão do usuário e ver se ele está autenticado
  const session = await getServerSession(authOptions);
  // esta pagina só pode ser acessada se o usuário estiver autenticado
  //podemos criar um middleware para isso, rotas protegidas
  if (!session?.user) {
    redirect("/");
  }

  interface UserSession {
    id: string;
  }
  // melhor fazer o filtro pelo bd, pois gasta menos memoria do servidor, pela js gastaria mais e com a promisse fica mais rapido para acessar e renderizar
  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: (session.user as UserSession).id,
        date: {
          gte: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
    db.booking.findMany({
      where: {
        userId: (session.user as UserSession).id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
  ]);

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>
        {confirmedBookings.length !== 0 && finishedBookings.length !== 0 && (
          <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
            Confirmados
          </h2>
        )}
        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
        {finishedBookings.length !== 0 && (
          <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
            Finalizados
          </h2>
        )}
        <div className="flex flex-col gap-3">
          {finishedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  );
};

// esta e uma pagina user service

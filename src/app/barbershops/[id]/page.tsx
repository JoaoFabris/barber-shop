import { db } from "@/app/_lib/prisma";
import BarberShopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


const BarbershopDetailsPage = async ({
    params,
  }: {
    params: { id: string }
  }) => {
  // params já é um objeto, não precisa de await!
  const session = await getServerSession(authOptions);

  if (!params.id) return null;

  const barbershop = await db.barbershop.findUnique({
    where: { id: params.id },
    include: { services: true },
  });

  if (!barbershop) return null;

  const serializedServices = barbershop.services.map((service) => ({
    ...service,
    price: parseFloat(service.price.toString()),
  }));

  const serializedBarbershop = {
    ...barbershop,
    services: serializedServices,
  };

  return (
    <div className="px-5 flex flex-col gap-4 py-6">
      <BarberShopInfo barbershop={serializedBarbershop} />
      {serializedServices.map((service) => (
        <ServiceItem
          key={service.id}
          barbershop={serializedBarbershop}
          service={service}
          isAuthenticated={!!session?.user}
        />
      ))}
    </div>
  );
};

export default BarbershopDetailsPage;
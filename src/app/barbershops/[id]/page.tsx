import { db } from "@/app/_lib/prisma";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import BarbershopInfo from "./_components/barbershop-info";
import { authOptions } from "@/app/_lib/auth";
import { notFound } from "next/navigation";

export default async function BarberShopPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!params?.id) {
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: { id: params.id },
    include: { services: true }
  });

  if (!barbershop) {
    return notFound(); // Lida com o caso em que a barbearia não existe
  }

  const barbershopSerialized = {
    ...barbershop,
    services: barbershop.services.map(service => ({
      ...service,
      price: Number(service.price),
    }))
  };

  return (
    <div>
      <BarbershopInfo barbershop={barbershopSerialized} />
      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershopSerialized.services.map((service) => (
          <ServiceItem
            key={service.id}
            barbershop={barbershopSerialized}
            service={service}
            isAuthenticated={!!session?.user}
          />
        ))}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { db } from "@/app/_lib/prisma";
import BarberShopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface BarbershopDetailsPageProps {
  params: { id?: string };
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
    const session = await getServerSession(authOptions); // n pode usar o useSession aqui, pois é um componente de servidor

    if (!params.id) return null;
    
    const barbershop = await db.barbershop.findUnique({
        where: {
            id: params.id,
        },
        include: {
            services: true,
        }
    });
    
    if (!barbershop) {
        return null;
    }

    // Serializa os serviços para converter os objetos Decimal para number
    const serializedServices = barbershop.services.map(service => ({
        ...service,
        price: parseFloat(service.price.toString())
    }));

    // Cria uma versão serializada do barbershop
    const serializedBarbershop = {
        ...barbershop,
        services: serializedServices
    };

    return (
        <div className="px-5 flex flex-col gap-4 py-6">
            <BarberShopInfo barbershop={serializedBarbershop} />
            {serializedServices.map(service => (
                <ServiceItem key={service.id} barbershop={serializedBarbershop} service={service} isAuthenticated={!!session?.user}/>
            ))}
        </div>
    );
};

export default BarbershopDetailsPage;
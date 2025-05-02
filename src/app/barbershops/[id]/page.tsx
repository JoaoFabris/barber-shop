import { db } from "@/app/_lib/prisma";
import BarberShopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";

interface BarbershopDetailsPageProps {
  params: Promise<{ id?: string }> | { id?: string };
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
    const resolvedParams = await params;
    
    if (!resolvedParams.id) return null;
    
    const barbershop = await db.barbershop.findUnique({
        where: {
            id: resolvedParams.id,
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
        <div>
            <BarberShopInfo barbershop={serializedBarbershop} />
            {serializedServices.map(service => (
                <ServiceItem key={service.id} service={service} />
            ))}
        </div>
    );
};

export default BarbershopDetailsPage;
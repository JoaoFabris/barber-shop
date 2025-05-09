import { db } from "@/app/_lib/prisma";
import BarberShopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function BarbershopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);

    if (!resolvedParams.id) return null;
    
    const barbershop = await db.barbershop.findUnique({
        where: { id: resolvedParams.id },
        include: { services: true }
    });

    if (!barbershop) return null;

    const serializedServices = barbershop.services.map(service => ({
        ...service,
        price: parseFloat(service.price.toString())
    }));

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
}
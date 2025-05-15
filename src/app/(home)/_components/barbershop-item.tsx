"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Barbershop } from "@/generated/prisma";
import { StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/barbershops/${barbershop.id}`);
  }

  return (
    <Card className="min-w-full max-w-full rounded-2xl">
      <CardContent className="p-0">
        <div className="px-1 relative w-full h-[159px]">
          <div className="absolute top-2 left-2 z-50">
            <Badge variant="secondary" className="flex items-center top-3 left-3 gap-1 opacity-90">
              <StarIcon size={12}  className="fill-primary text-primary"/>
                <span className="text-xs">{barbershop.averageRating}</span>
            </Badge>
          </div>
          <Image
            src={barbershop.imageUrl}
            alt={barbershop.name}
            fill
            style={{ objectFit: "cover" }}
            className="h-[159px] rounded-2xl"
          />
        </div>
        <div className="px-3 pb-3">
          <h2 className="font-bold overflow-hidden text-ellipsis text-nowrap">{barbershop.name}</h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">
            {barbershop.address}
          </p>
          <Button className="w-full mt-3" variant="secondary" onClick={handleClick}>
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarbershopItem;

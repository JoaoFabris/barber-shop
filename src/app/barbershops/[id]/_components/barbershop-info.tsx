"use client";

import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Barbershop } from "@/generated/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface barberShopInfoProps {
  barbershop: Barbershop;
}

const BarberShopInfo = ({ barbershop }: barberShopInfoProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.replace("/");
  };
  return (
    <div>
      <div className="w-full h-[250px] relative">
        <Button
          size="icon"
          variant="secondary"
          className="z-50 absolute top-4 left-4"
          onClick={handleBackClick}
        >
          <ChevronLeftIcon />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="z-50 absolute top-4 right-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SideMenu />
          </SheetContent>
        </Sheet>
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          fill
          style={{ objectFit: "cover" }}
          className="opacity-75"
        />
      </div>

      <div className="px-5 pt-3 pb-6 border-b border-secondary border-solid">
        <h1 className="text-xl font-bold">{barbershop.name}</h1>
        <div className="flex items-center gap-1 mt-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{barbershop.address}</p>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <StarIcon className="text-primary" size={18} />
          <p className="text-sm">{barbershop.averageRating} ({barbershop.ratingCount} avaliações)</p>
        </div>
      </div>
    </div>
  );
};

export default BarberShopInfo;

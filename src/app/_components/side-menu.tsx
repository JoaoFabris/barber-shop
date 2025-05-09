"use client";

import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const SideMenu = () => {
  const { data } = useSession();

  const handleLoginClick = () => {
    signIn("google");
  };

  const handleLogout = () => {

    signOut();
  };
  return (
    <div>
      <SheetHeader className="text-left">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      {data?.user ? (
        <div className="flex justify-beetween px-5 py-6 items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                className="w-10 h-10 rounded-full object-cover"
                src={data.user.image || ""}
                alt="User profile"
              />
            </Avatar>

            <h2 className="font-bold">{data.user.name}</h2>
          </div>
          <Button variant="secondary" size="icon" onClick={handleLogout}>
            <LogOutIcon />
          </Button>
        </div>
      ) : (
        <div className="gap-3 px-5 py-6 flex flex-col">
          <div className="flex items-center gap-2">
            <UserIcon />
            <h2 className="font-bold">Olá, faça seu Login!</h2>
          </div>
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleLoginClick}
          >
            <LogInIcon size={18} className="mr-2" />
            Fazer Login
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <Button
          variant="outline"
          className="item-center justify-center"
          asChild
        >
          <Link href="/">
            <HomeIcon size={18} className="mr-2" />
            Inicio
          </Link>
        </Button>

        {data?.user && (
          <Button
            variant="outline"
            className="item-center justify-center"
            asChild
          >
            <Link href="/bookings">
              <CalendarIcon size={18} className="mr-2" />
              Agendamentos
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SideMenu;

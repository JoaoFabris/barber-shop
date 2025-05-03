"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  MenuIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,

  SheetTrigger,
} from "@/components/ui/sheet";
import SideMenu from "./side-menu";

const Header = () => {


  return (
    <Card>
      <CardContent className="px-5 py-8 justify-between flex flex-row">
        <Link href="/">
          <Image src="/Imagem2.png" alt="FSW Barber" height={5} width={120} />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon size={16} />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SideMenu/>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Header;

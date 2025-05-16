"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ptBR } from "date-fns/locale/pt-BR";
import { format, isPast } from "date-fns";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cancelBooking } from "../_action/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import RatingForm from "./ratingForm";
import { rateBarbershop } from "../_action/rate-barbershop";

interface BookingItemProps {
  booking: {
    id: string;
    date: Date;
    service: {
      id: string;
      barbershopId: string;
      name: string;
      description: string;
      imageUrl: string;
      price: number; // <- troque Decimal por number!
    };
    barbershop: {
      id: string;
      name: string;
      imageUrl: string;
      address: string;
    };
  };
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isBookingConfirmed = isPast(booking.date);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleCancelClick = async () => {
    setIsDeleteLoading(true);
    try {
      await cancelBooking(booking.id);

      toast.success("Reserva cancelada com sucesso!");
    } catch (_error) {
      toast.error("Ocorreu um erro ao cancelar a reserva. Tente novamente.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleRatingSubmit = async (rating: number) => {
    try {
      await rateBarbershop(booking.barbershop.id, rating);
      toast.success("Avaliação enviada com sucesso!");
      setSheetOpen(false); // Fecha o Sheet após avaliação bem-sucedida
    } catch (_error) {
      toast.error("Erro ao enviar avaliação.",);
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Card className="min-w-full">
          <CardContent className="p-5 flex justify-between py-0">
            <div className="flex flex-col gap-2 py-5">
              <Badge variant={isBookingConfirmed ? "secondary" : "default"}>
                {isBookingConfirmed ? "Finalizado" : "Confirmado"}
              </Badge>
              <h2 className="font-bold">{booking.service.name}</h2>
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>Img Error</AvatarFallback>
                </Avatar>
                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center px-3">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", {
                  locale: ptBR,
                })}
              </p>
              <p className="text-2xl">
                {" "}
                {format(booking.date, "dd", {
                  locale: ptBR,
                })}
              </p>
              <p className="text-sm">
                {" "}
                {format(booking.date, "hh:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className="px-5 text-left pb-6 border-b border-solid border-secondary">
          <SheetTitle>Informações da reserva</SheetTitle>
        </SheetHeader>
        <div className="px-5">
          <div className="relative h-[180px] w-full mt-6">
            <Image
              src="/barbershop-map.png"
              fill
              alt={booking.barbershop.name}
            />
            <div className="w-full absolute bottom-4 left-0 px-5">
              <Card>
                <CardContent className="p-3 flex gap-2">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>

                  <div>
                    <h2 className="font-bold">{booking.barbershop.name}</h2>
                    <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">
                      {booking.barbershop.address}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Badge
            className="mt-3 mb-6"
            variant={isBookingConfirmed ? "secondary" : "default"}
          >
            {isBookingConfirmed ? "Finalizado" : "Confirmado"}
          </Badge>

          <Card>
            <CardContent className="p-3 gap-3 flex flex-col">
              <div className="flex justify-between">
                <h2 className="font-bold">{booking.service.name}</h2>
                <h3 className="font-bold text-sm">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service.price))}
                </h3>
              </div>

              <div className="flex justify-between">
                <h3 className="text-sm">Data</h3>
                <h4 className="text-sm text-gray-400">
                  {format(booking.date, "dd 'de' MMMM", {
                    locale: ptBR,
                  })}
                </h4>
              </div>

              <div className="flex justify-between">
                <h3 className="text-sm">Horário</h3>
                <h4 className="text-sm text-gray-400">
                  {format(booking.date, "hh:mm")}
                </h4>
              </div>

              <div className="flex justify-between">
                <h3 className="text-sm">Barbearia</h3>
                <h4 className="text-sm text-gray-400">
                  {booking.barbershop.name}
                </h4>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col justify-center items-center mt-4">
            <RatingForm onRatingSubmit={handleRatingSubmit} />
          </div>
          <SheetFooter className="flex flex-row gap-3 mt-6">
            <SheetClose asChild>
              <Button variant="secondary" className="flex-1 basis-0">
                Voltar
              </Button>
            </SheetClose>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isBookingConfirmed || isDeleteLoading}
                  variant="destructive"
                  className="flex-1 basis-0"
                >
                  Cancelar reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar reserva?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza? Uma vez cancelada, não sera possivel reverter
                    essa ação
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeleteLoading}
                    onClick={handleCancelClick}
                  >
                    Confirmar
                    {isDeleteLoading && (
                      <Loader2 className="animate-spin" size={16} />
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
// pode add telefone do barber no component

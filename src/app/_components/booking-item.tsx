import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Prisma } from "@/generated/prisma";
import { ptBR } from "date-fns/locale/pt-BR";
import { format, isPast } from "date-fns";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isBookingConfirmed = isPast(booking.date)
  return (
    <Card className="min-w-full">
      <CardContent className="p-5 flex justify-between py-0">
        <div className="flex flex-col gap-2 py-5">
          <Badge variant={
           isBookingConfirmed ? "secondary" : "default"
          }>{isBookingConfirmed ? "Finalizado" : "Confirmado"}</Badge>
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
          <p className="text-2xl"> {format(booking.date, "dd", {
              locale: ptBR,
            })}</p>
          <p className="text-sm"> {format(booking.date, "hh:mm", {
              locale: ptBR,
            })}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingItem;

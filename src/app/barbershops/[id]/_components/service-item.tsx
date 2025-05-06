"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Barbershop, Service } from "@/generated/prisma";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ptBR } from "date-fns/locale/pt-BR";
import { generateDayTimeList } from "../_helpers/hours";
import { format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Omit<Service, "price"> & { price: number };
  isAuthenticated?: boolean;
}

const ServiceItem = ({
  service,
  isAuthenticated,
  barbershop,
}: ServiceItemProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState<string | undefined>(undefined);
  const [submitLoading, setSubmitLoading] = useState(false);
  const[sheetOpen, setSheetOpen] = useState(false);

  const router = useRouter();
  const { data } = useSession();

  const handleHoutrClick = (time: string) => {
    setHour(time);
  };

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
    console.log(date);
    console.log(hour);
  };

  const handleBookingSubmit = async () => {
    if (!data?.user || !isAuthenticated) {
      signIn();
      return;
    }
    setSubmitLoading(true);
    try {
      if (!hour || !date || !data?.user) {
        return;
      }
      const dateHour = Number(hour?.split(":")[0]);
      const dateMinute = Number(hour?.split(":")[1]);

      const newDate = setMinutes(setHours(date, dateHour), dateMinute);
      // salvo no bd no formato UTC, então preciso converter para o formato UTC e no frontend a gente mostra no formato local, por isso vamos ver o horario diferente no bd
      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (data.user as { id: string }).id,
      });
      console.log("Reserva feita com sucesso", newDate);

      setHour(undefined);
      setDate(undefined);
      // resetar o estado do componente
      setSheetOpen(false);
      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "dd 'de' MMMM 'às' HH:mm", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.log("Error booking service", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : []; // com o isso useMemo não vai gerar a lista de horários toda vez que o componente renderizar poupando processamento
  }, [date]);
  return (
    <Card>
      <CardContent className="p-3 w-full">
        <div className="flex gap-4 items-center w-full">
          <div className="relative w-[110px] h-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-[#B466E4] font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(service.price)}
              </p>
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary">
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6 border-b border-secondary">
                    <SheetTitle>Fazer reserva</SheetTitle>
                  </SheetHeader>

                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateClick}
                    fromDate={new Date()}
                    locale={ptBR}
                    className="rounded-md border"
                    styles={{
                      head_cell: {
                        width: "100%",
                        textTransform: "capitalize",
                      },
                      cell: {
                        width: "100%",
                      },
                      button: {
                        width: "100%",
                      },
                      nav_button_previous: {
                        width: "fit-content",
                      },
                      nav_button_next: {
                        width: "fit-content",
                      },
                      caption: {
                        textTransform: "capitalize",
                      },
                    }}
                  />
                  {/* {mostrar lista de horários disponíveis aqui se uma data for selecionada}  */}
                  {date && (
                    <div className="py-6 gap-3 px-5 border-b border-secondary flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button
                          key={time}
                          className="rounded-full"
                          variant={hour === time ? "default" : "outline"}
                          onClick={() => handleHoutrClick(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="py-6 px-5">
                    <Card>
                      <CardContent className="p-3 gap-3 flex flex-col">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-sm">Data</h3>
                            <h4 className="text-sm text-gray-400">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-sm">Horário</h3>
                            <h4 className="text-sm text-gray-400">{hour}</h4>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-sm">Barbearia</h3>
                          <h4 className="text-sm text-gray-400">
                            {barbershop.name}
                          </h4>
                        </div>
                      </CardContent>
                    </Card>

                    <SheetFooter className="flex justify-end mt-4">
                      <Button
                        variant="default"
                        onClick={handleBookingSubmit}
                        disabled={!date || !hour || submitLoading}
                      >
                        {submitLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <span>
                            {data?.user ? "Reservar" : "Fazer login para reservar"}
                          </span>
                        )}
                      </Button>
                    </SheetFooter>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;

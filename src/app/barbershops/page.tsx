import { redirect } from "next/navigation";
import BarbershopItem from "../(home)/_components/barbershop-item";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import Search from "../(home)/_components/search";

const BarbershopsPage = async (props: {
  searchParams: Promise<{ search: string }>;
}) => {
  const searchParams = await props.searchParams;

  if (!searchParams?.search) {
    redirect("/");
  }
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });
  return (
    <>
      <Header />

      <div className="px-5 py-6 flex flex-col gap-6">
        <Search defaultValue={searchParams.search} />
        <h1 className="text-gray-400 font-bold text-xs uppercase">
          {" "}
          Resultados para {searchParams.search}
        </h1>

        <div className="grid grid-cols-2 mt-3 gap-4">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="w-full">
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BarbershopsPage;

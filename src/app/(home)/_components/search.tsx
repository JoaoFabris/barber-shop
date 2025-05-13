"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  search: z
    .string({
      required_error: "Campo obrigatório",
    })
    .trim()
    .min(1, "Campo obrigatório"),
});

// Adicione uma interface para as props
interface SearchProps {
  defaultValue?: string;
}

// Aceite as props no componente
const Search = ({ defaultValue = "" }: SearchProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Use o defaultValue nas defaultValues do formulário
    defaultValues: {
      search: defaultValue || "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    router.push(`/barbershops?search=${data.search}`);
  };
  
  return (
    <div className="flex items-center gap-2">
      <Form {...form}>
        <form className="flex w-full gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Busque por uma barbearia..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="default" size="icon" type="submit">
            <SearchIcon size={18} />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Search;
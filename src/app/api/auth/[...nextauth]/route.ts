import { db } from "@/app/_lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  //Callback chamado toda vez que uma sessão é criada ou acessada.
  //Acrescenta o id do usuário à sessão retornada pro frontend (não vem por padrão).
  // Isso é útil para quando você quer acessar o id do usuário no frontend.
  callbacks: {
    async session({ session, user }) {
      session.user = { ...session.user, id: user.id } as {
        id: string;
        name: string;
        email: string;
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, //esse secret precisa estar populado para fazer deploy, em produção esse secret é necessáio e deve ser colocado no .env
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

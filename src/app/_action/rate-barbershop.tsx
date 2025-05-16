"use server";

import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";

export const rateBarbershop = async (barbershopId: string, score: number) => {
  interface UserSession {
    id: string;
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const userId = (session.user as UserSession).id;
    
    // Verificar se a avaliação já existe
    const existingRating = await db.rating.findFirst({
      where: { userId, barbershopId },
    });
    
    // Atualizar ou criar a avaliação
    if (existingRating) {
      await db.rating.update({
        where: { id: existingRating.id },
        data: { score },
      });
    } else {
      await db.rating.create({
        data: { score, userId, barbershopId },
      });
    }
    
    // Buscar todas as avaliações da barbearia para calcular a média
    const ratings = await db.rating.findMany({
      where: { barbershopId },
      select: { score: true },
    });
    
    // Calcular a média
    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    const averageRating = ratings.length > 0 ? totalScore / ratings.length : 0;
    
    // IMPORTANTE: Atualizar a barbearia com a nova média
    await db.barbershop.update({
      where: { id: barbershopId },
      data: { averageRating, ratingCount: ratings.length, }, // o data escolhe qual campo atualizar
      
    });
  
    
    return { success: true, averageRating, ratingCount: ratings.length };
  } catch (error) {
    console.error("Error na avaliação", error);
    throw new Error("Erro ao salvar avaliação");
  }
};
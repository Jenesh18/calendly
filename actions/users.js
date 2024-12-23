"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUsername(username) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthorized");
  }

  // check if username is already taken

  const existingUser = await db.user.findUnique({
    where: { username },
  });

  if (existingUser && existingUser.clerkUserId !== userId) {
    return { status: 401, error: 1, message: "Username is already taken" };
  }

  // Update username in database
  await db.user.update({
    where: { clerkUserId: userId },
    data: { username },
  });

  await clerkClient().users.updateUser(userId,{
    username
  });

  return {status:200, error: 0, message: "Username updated successfully!"}
}

export async function getUserByUsername(username) {

  const user = await db.user.findUnique({
    where: { username },
    select:{
      id:true,
      name:true,
      email:true,
      imageUrl:true,
      events:{
        where:{
          isPrivate:false,
        },
        orderBy:{
          createdAt:"desc",
        },
        select:{
          id:true,
          title:true,
          description:true,
          duration:true,
          isPrivate:true,
          _count:{
            select:{bookings:true},
          }
        }
      },
    }
  });

  return user;
}

"use server";

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createEvent(data) {
    const { userId } = auth();

    if (!userId) {
        return { status: 401, error: 1, message: "Unauthorized" }; 
    }

    const validatedData = eventSchema.parse(data);

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        return { status: 404, error: 1, message: "User not found" }; 
    }

    const event = await db.event.create({
        data: {
            ...validatedData,
            userId: user.id
        },
    });

    return { status: 200, error: 0, message: "Event created successfully." };
}

export async function getUserEvents() {
    const { userId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }


    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        throw new Error("User not found")
    }

    const events = await db.event.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { bookings: true }
            },
        },
    });

    return { events, username: user.username };
}


export async function deleteEvent(eventId) {
    const { userId } = auth();

    if (!userId) {
        return { status: 401, error: 1, message: "Unauthorized" }; 
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        return { status: 404, error: 1, message: "User not found" }; 
    }

    const event = await db.event.findUnique({
        where: { id: eventId },
    });

    if (!event) {
        return { status: 404, error: 1, message: "Event not found." };
    }

    if (event.userId !== user.id) {
        return { status: 401, error: 1, message: "You are not authorized to delete this event." };
    }

    await db.event.delete({
        where: { id: eventId },
    });

    return { status: 200, error: 0, message: "Event deleted successfully." };
}


export async function getEventDetails(username,eventId) {
    const event = await db.event.findFirst({
      where:{
        id:eventId,
        user:{
            username:username
        },
      },
      include:{
        user:{
            select:{
                name:true,
                email:true,
                imageUrl:true,
            },
        },
      }
    });

    return event;
}
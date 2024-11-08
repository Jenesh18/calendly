"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, format, isBefore, parseISO, startOfDay } from "date-fns";

export async function getUserAvailability() {
    const { userId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
            availability: {
                include: { days: true },
            },
        },
    });

    if (!user || !user.availability) {
        return null;
    }

    const availabilityData = { timeGap: user.availability.timeGap };

    [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ].forEach((day) => {
        const dayAvailability = user.availability.days.find(
            (d) => d.day === day.toUpperCase()
        );

        availabilityData[day] = {
            isAvailable: !!dayAvailability,
            startTime: dayAvailability
                ? dayAvailability.startTime.toISOString().slice(11, 16)
                : "09:00",
            endTime: dayAvailability
                ? dayAvailability.endTime.toISOString().slice(11, 16)
                : "17:00",
        };

    });
    return availabilityData;
}

export async function updateAvailability(data) {
    const { userId } = auth();

    if (!userId) {
        return { status: 401, error: 1, message: "Unauthorized" }; 
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { availability: true },
    });

    if (!user) {
        return { status: 404, error: 1, message: "User not found" }; 
    }

    const availabilityData = Object.entries(data).flatMap(
        ([day, { isAvailable, startTime, endTime }]) => {
            if (isAvailable) {
                const baseDate = new Date().toISOString().split("T")[0];

                return [
                    {
                        day: day.toUpperCase(),
                        startTime: new Date(`${baseDate}T${startTime}:00Z`),
                        endTime: new Date(`${baseDate}T${endTime}:00Z`),
                    },
                ];
            }
            return [];
        }
    );

    try {
        if (user.availability) {
            await db.availability.update({
                where: { id: user.availability.id },
                data: {
                    timeGap: data.timeGap,
                    days: {
                        deleteMany: {},
                        create: availabilityData,
                    },
                },
            });
        } else {
            await db.availability.create({
                data: {
                    userId: user.id,
                    timeGap: data.timeGap,
                    days: {
                        create: availabilityData,
                    },
                },
            });
        }

        return { status: 200, error: 0, message: "Availability updated successfully" }; 

    } catch (error) {
        console.error("Error updating availability:", error);
        return { status: 500, error: 1, message: "An error occurred while updating availability" }; 
    }
}


export async function getEventAvailability(eventId) {

const event = await db.event.findUnique({
    where: {id:eventId},
    include:{
        user:{
            include:{
                availability:{
                    select:{
                        days:true,
                        timeGap:true,
                    },
                },
                bookings:{
                    select:{
                        startTime:true,
                        endTime:true,
                    },
                },
            },
        },
    },
});

if(!event || !event.user.availability){
    return [];
}

const {availability , bookings} = event.user;

const startDate = startOfDay(new Date());
const endDate = addDays(startDate,30);

const availableDates = [];

for(let date = startDate;  date <= endDate; date = addDays(date,1)){
    const dayOfWeek = format(date,"EEEE").toUpperCase();

    const dayAvailability = availability?.days?.find(
        (d) => d.day === dayOfWeek
    )

    if(dayAvailability){
        const dateStr = format(date,"yyyy-MM-dd");

        const slots = generateAvailableTimeSlots(
          dayAvailability.startTime,
          dayAvailability.endTime,
          event.duration,
          bookings,
          dateStr,
          availability.timeGap
        );


        availableDates.push({
            date:dateStr,
            slots,
        });
    }
}
  return availableDates ;
}

function generateAvailableTimeSlots(
  startTime,
  endTime,
  duration,
  bookings,
  dateStr,
  timeGap = 0   
){
  const slots = [];

  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11,16)}`
  );

  let slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11,16)}`
  );
  
  // If the date is today, start from the next available slot after the current time

  const now = new Date();

  if(format(now, "yyyy-MM-dd") === dateStr){
  currentTime = isBefore(currentTime, now) ?addMinutes(now, timeGap) : currentTime;
  }

  while(currentTime < slotEndTime){
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    const isSlotAvailable = !bookings.some((booking) =>{
        const bookingStart = booking.startTime;
        const bookingEnd = booking.endTime;
        return(
            (currentTime >= bookingStart && currentTime < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (currentTime <= bookingStart && slotEnd >= bookingEnd) 

        );
    });
    if(isSlotAvailable){
        slots.push(format(currentTime,"HH:mm"));
    }
    currentTime = slotEnd ;
  }
  return slots;


}


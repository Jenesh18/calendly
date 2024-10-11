
import { getEventDetails } from "@/actions/events";
import { notFound } from "next/navigation";
import EventDetails from "./_components/event-details";

export async function generateMetadata({ params }) {
    const event = await getEventDetails(params.username,params.eventId);
  
    if (!event) {
      return {
        title: "Event Not Found",
      };
    }
  
    return {
        title: `Book ${event.title} with ${event.user.name} | Your App Name`,
        description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}.`,
      };
}

export default async function EventBookingPage({ params }) {
  const event  = await getEventDetails(params.username,params.eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col justify-center lg:flex-row px-4 py-8">
     <EventDetails event={event}/>
    </div>
  );
}

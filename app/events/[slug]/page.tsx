import { Suspense } from 'react';
import Image from "next/image";
import { notFound } from "next/navigation";

import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import type { IEvent } from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// --- Helper Components ---

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItem }: { agendaItem: string | string[] }) => {
  const items = Array.isArray(agendaItem) ? agendaItem : [agendaItem];
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map(tag => (
      <div key={tag} className="pill">{tag}</div>
    ))}
  </div>
);

// --- Async Data Components ---

// 1. Accepts the `params` Promise directly
async function EventMainContent({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params INSIDE the component, which is wrapped in Suspense
  const { slug } = await params;

  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const data = await response.json();

  if (!data?.event?.description) return notFound();

  const { date, description, image, overview, time, location, mode, agenda, audience, tags, organizer } = data.event;
  const bookings = 10;

  return (
    <>
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image className="banner" src={image} alt={description} width={800} height={800} />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="location" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
          </section>

          <EventAgenda agendaItem={agenda} />

          <section className="flex-col-gap-2">
            <h2>About The Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">join {bookings} people who have already booked their spots</p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}
            <BookEvent eventId={data.event._id} slug={data.event.slug} />
          </div>
        </aside>
      </div>
    </>
  );
}

// 2. Accepts the `params` Promise directly
async function SimilarEventsList({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const similarEvents = await getSimilarEventsBySlug(slug);

  return (
    <div className="events">
      {similarEvents && (similarEvents as unknown as IEvent[]).length > 0 ? (
        (similarEvents as unknown as IEvent[]).map((similarEvent) => (
          <EventCard {...similarEvent} key={similarEvent.title} />
        ))
      ) : (
        <p>No similar events found.</p>
      )}
    </div>
  );
}

// --- Main Page Component ---

// Note: We accept `params`, but we DO NOT await it here.
const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <div>
      <section id='event'>

        {/* Pass the promise down to the suspended component */}
        <Suspense fallback={<div className="text-center pt-10">Loading event details...</div>}>
          <EventMainContent params={params} />
        </Suspense>

        <div className="flex w-full flex-col gap-4 pt-20">
          <h2>Similar Events</h2>

          {/* Pass the promise down here too */}
          <Suspense fallback={<div className="text-center">Loading similar events...</div>}>
            <SimilarEventsList params={params} />
          </Suspense>
        </div>

      </section>
    </div>
  );
};

export default EventDetailsPage;
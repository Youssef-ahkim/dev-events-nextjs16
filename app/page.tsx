import { Suspense } from 'react';
import EventCard from '@/components/EventCard';
import ExploreBtn from '@/components/ExploreBtn';
import { IEvent } from '@/database/event.model';
import { cacheLife } from 'next/cache';
import { events } from '@/lib/constants';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// 1. Create a separate component for fetching and displaying the list
async function EventList() {
  // This fetch happens inside the Suspense boundary now
  // const response = await fetch(`${BASE_URL}/api/events`);
  // const { events } = await response.json();

  return (
    <ul className='events'>
      {events && events.length > 0 ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events.map((event: any) => (
          <li className='event' key={event.title}>
            <EventCard {...event} />
          </li>
        ))
      ) : (
        <p>No events found.</p>
      )}
    </ul>
  );
}

// 2. The Main Page Component
const Page = async () => {

  "use cache";
  cacheLife("hours");


  return (
    <section>
      {/* These static elements will render immediately */}
      <h1 className='text-center'>
        The Hub For Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className='text-center mt-5'>Hackathons, Meetups, and Conferences</p>

      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>
        
        {/* The Suspense boundary handles the loading state for the data */}
        <Suspense fallback={<div className="text-center">Loading events...</div>}>
          <EventList />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
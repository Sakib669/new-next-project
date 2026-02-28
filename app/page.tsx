import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { Event, IEvent } from "@/database";
import connectDB from "@/lib/mongodb";
import { cacheLife } from "next/cache";

interface Props {}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async ({}: Props) => {
  "use cache";
  cacheLife("hours");
  await connectDB();
  const events = await Event.find({}).lean();
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br />
        Event You Can't Miss
      </h1>
      <p className="text-center ml-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events list-none   ">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;

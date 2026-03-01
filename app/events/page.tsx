"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader, AlertCircle, Plus } from "lucide-react";

// tsrfc pattern follow করা হয়েছে
interface Event {
  _id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  image: string;
  slug: string;
}

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events);
        } else {
          setError(data.message || "Failed to fetch events");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center gap-4">
        <Loader className="animate-spin text-blue-500" size={40} />
        <p className="text-slate-400 font-medium animate-pulse">
          Loading events...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 pb-20">
      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Upcoming Events
          </h2>
          <p className="text-slate-400">
            Discover and join the latest tech gatherings
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-400 mb-8">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link
              href={`/events/${event.slug}`}
              key={event._id}
              id="event-card"
              className="group block bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden hover:border-blue-500/40 transition-all"
            >
              {/* Image mapping with next/image */}
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={event.image || "/placeholder-event.jpg"}
                  alt={event.title}
                  fill
                  className="poster object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-row gap-2 items-center mb-3 text-slate-400">
                  <Image
                    src="/icons/pin.svg"
                    alt="location"
                    width={14}
                    height={14}
                    className="opacity-70"
                  />
                  <p className="text-xs truncate">{event.venue}</p>
                </div>

                <p className="title text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {event.title}
                </p>

                <div className="datetime flex items-center justify-between border-t border-slate-800/50 pt-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Image
                      src="/icons/calendar.svg"
                      alt="date"
                      width={14}
                      height={14}
                      className="opacity-70"
                    />
                    <p className="text-xs">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Image
                      src="/icons/clock.svg"
                      alt="time"
                      width={14}
                      height={14}
                      className="opacity-70"
                    />
                    <p className="text-xs">{event.time}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {events.length === 0 && !error && (
          <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
            No events found.
          </div>
        )}
      </main>
    </div>
  );
}

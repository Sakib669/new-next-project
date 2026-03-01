'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, Loader, AlertCircle, Plus } from 'lucide-react';

// tsrfc pattern for interfaces
interface Event {
  _id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  image?: string;
}

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        
        if (response.ok) {
          setEvents(data.events);
        } else {
          setError(data.message || 'Failed to fetch events');
        }
      } catch (err) {
        setError('Network error. Please try again.');
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
        <p className="text-slate-400 font-medium animate-pulse">Loading amazing events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 pb-20">
      {/* Navbar Section */}
      <nav className="sticky top-0 z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            DevEvents
          </h1>
          <Link 
            href="/events/create" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-lg shadow-blue-900/20"
          >
            <Plus size={18} /> Create Event
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-2">Upcoming Events</h2>
          <p className="text-slate-400">Discover and join the latest tech gatherings</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-400 mb-8">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {events.length === 0 && !error ? (
          <div className="text-center py-20 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500 text-lg">No events found yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event._id} 
                className="group bg-slate-900/50 border border-slate-800/50 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5"
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-slate-950 relative overflow-hidden">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-800">
                      <Calendar size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    Upcoming
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar size={16} className="text-blue-500" />
                      <span className="text-xs font-medium">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Clock size={16} className="text-blue-500" />
                      <span className="text-xs font-medium">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <MapPin size={16} className="text-blue-500" />
                      <span className="text-xs font-medium line-clamp-1">{event.venue}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/events/${event._id}`}
                    className="w-full py-3 border border-slate-700 hover:border-blue-500/50 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-blue-500/10 transition-all"
                  >
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
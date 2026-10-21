import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
  Zap,
  Globe,
  Award,
} from 'lucide-react';
import type { EventItem, Registration } from '../types';
import { eventService } from '../services/api';
import { EventCard } from '../components/EventCard';
import { BookingModal } from '../components/BookingModal';
import { TicketModal } from '../components/TicketModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<EventItem | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    eventService.getEvents().then((data) => {
      setEvents(data.filter((e) => e.status === 'published'));
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/events');
    }
  };

  const categories = [
    'All',
    'Technology',
    'Music & Concerts',
    'Business & Networking',
    'Workshops & Education',
    'Sports & Fitness',
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'All') return true;
    return e.category === selectedCategory;
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Next-Generation Cloud Event Management System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Discover, Host & Connect at <br />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              World-Class Events
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Effortlessly discover tech summits, music festivals, coding bootcamps, and professional workshops. Instant
            e-ticket generation, live seat tracking, and seamless cloud scalability.
          </p>

          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-3 px-3 w-full text-slate-300">
                <Search className="w-5 h-5 text-indigo-300 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by event title, topic (Docker, React), or venue..."
                  className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                Find Events
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/10 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">150+</div>
              <div className="text-xs text-slate-400 mt-1">Live Events Hosted</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">12,500+</div>
              <div className="text-xs text-slate-400 mt-1">Tickets Issued</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">99.9%</div>
              <div className="text-xs text-slate-400 mt-1">Cloud Availability</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">Docker</div>
              <div className="text-xs text-slate-400 mt-1">Render Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured & Filtered Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Experiences</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Events Near You</h2>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            Browse all events
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.slice(0, 6).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onQuickBook={(evt) => setSelectedEventForBooking(evt)}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No events found in this category.</p>
          </div>
        )}
      </section>

      {/* Why Choose Platform Features */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Engineered for Reliability</h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-500">
              Everything needed to discover, register, and organize community gatherings, workshops, and enterprise summits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Real-time Seat Allocation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live inventory tracking prevents double-booking. Transparent seat capacity counters update synchronously.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Instant QR E-Tickets</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Automated e-ticket generation with unique ticket codes and printable QR passes for swift on-site entry.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Cloud & Docker Ready</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Containerized with multi-stage Docker build, preconfigured for high-availability Render cloud deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Host CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-200">For Organizers</span>
            <h2 className="text-2xl sm:text-3xl font-bold">Planning a Conference, Workshop, or Meetup?</h2>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Publish your event in minutes. Manage attendee check-ins, track ticketing revenue, and review analytics
              all inside our dedicated Organizer Dashboard.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/organizer/events/new"
                className="px-6 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs transition-colors shadow-md shadow-black/10"
              >
                Create an Event Now
              </Link>
              <Link
                to="/organizer"
                className="px-6 py-3 rounded-xl bg-indigo-800/60 hover:bg-indigo-800/90 text-white font-semibold text-xs border border-white/20 transition-colors"
              >
                View Organizer Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        event={selectedEventForBooking}
        isOpen={!!selectedEventForBooking}
        onClose={() => setSelectedEventForBooking(null)}
        onSuccess={(reg) => {
          setSelectedEventForBooking(null);
          setConfirmedRegistration(reg);
          eventService.getEvents().then((data) => setEvents(data.filter((e) => e.status === 'published')));
        }}
      />

      {/* Ticket Modal */}
      <TicketModal
        registration={confirmedRegistration}
        isOpen={!!confirmedRegistration}
        onClose={() => setConfirmedRegistration(null)}
      />
    </div>
  );
};

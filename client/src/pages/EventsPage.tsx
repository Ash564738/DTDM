import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw } from 'lucide-react';
import type { EventItem, Registration } from '../types';
import { eventService } from '../services/api';
import { EventCard } from '../components/EventCard';
import { BookingModal } from '../components/BookingModal';
import { TicketModal } from '../components/TicketModal';

export const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'venue' | 'online'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price-asc' | 'price-desc'>('date');

  // Booking Modals
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<EventItem | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<Registration | null>(null);

  const fetchEvents = () => {
    setLoading(true);
    eventService.getEvents().then((data) => {
      setEvents(data.filter((e) => e.status === 'published'));
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const categories = [
    'All',
    'Technology',
    'Music & Concerts',
    'Business & Networking',
    'Workshops & Education',
    'Sports & Fitness',
    'Arts & Culture',
  ];

  const filteredEvents = events
    .filter((event) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = event.title.toLowerCase().includes(q);
        const matchDesc = event.description.toLowerCase().includes(q);
        const matchTag = event.tags.some((t) => t.toLowerCase().includes(q));
        const matchVenue = event.venueName?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchDesc && !matchTag && !matchVenue) return false;
      }

      if (category !== 'All' && event.category !== category) return false;
      if (priceFilter === 'free' && event.ticketPrice > 0) return false;
      if (priceFilter === 'paid' && event.ticketPrice === 0) return false;
      if (locationFilter === 'venue' && event.locationType !== 'venue') return false;
      if (locationFilter === 'online' && event.locationType !== 'online') return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.ticketPrice - b.ticketPrice;
      if (sortBy === 'price-desc') return b.ticketPrice - a.ticketPrice;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setPriceFilter('all');
    setLocationFilter('all');
    setSortBy('date');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Events</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Find and register for tech conferences, concerts, workshops, and meetups.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, topics..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Detailed Secondary Filters */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Price:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Events Only</option>
                <option value="paid">Paid Events</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Format:</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value as 'all' | 'venue' | 'online')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
              >
                <option value="all">All Formats</option>
                <option value="venue">In-Person (Venue)</option>
                <option value="online">Online Virtual Stream</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'price-asc' | 'price-desc')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
              >
                <option value="date">Upcoming Date</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredEvents.length}</strong> events
        </span>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onQuickBook={(evt) => setSelectedEventForBooking(evt)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching events found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing your filters, or browsing other categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        event={selectedEventForBooking}
        isOpen={!!selectedEventForBooking}
        onClose={() => setSelectedEventForBooking(null)}
        onSuccess={(reg) => {
          setSelectedEventForBooking(null);
          setConfirmedRegistration(reg);
          fetchEvents();
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

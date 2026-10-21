import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Share2,
  Check,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Ticket,
} from 'lucide-react';
import type { EventItem, Registration } from '../types';
import { eventService } from '../services/api';
import { formatDate, formatTime, formatPrice, getCategoryBadgeClass } from '../utils/formatters';
import { BookingModal } from '../components/BookingModal';
import { TicketModal } from '../components/TicketModal';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Booking Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [confirmedRegistration, setConfirmedRegistration] = useState<Registration | null>(null);

  const fetchEvent = async () => {
    if (!id) return;
    setLoading(true);
    const data = await eventService.getEventById(id);
    setEvent(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
        <p className="text-xs text-slate-500">The event you are looking for does not exist or has been removed.</p>
        <Link
          to="/events"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;
  const seatPercentage = Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to previous page
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
          {copied ? 'Link Copied!' : 'Share Event'}
        </button>
      </div>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 aspect-[21/9] max-h-[460px]">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-md border ${getCategoryBadgeClass(
              event.category
            )}`}
          >
            {event.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-indigo-700 shadow-md">
            {formatPrice(event.ticketPrice, event.currency)}
          </span>
        </div>

        {/* Hero Title & Info */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug drop-shadow-md">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Calendar className="w-4 h-4 text-indigo-300" />
              <span>{formatDate(event.startDate)}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Clock className="w-4 h-4 text-purple-300" />
              <span>
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              {event.locationType === 'online' ? (
                <>
                  <Video className="w-4 h-4 text-rose-300" />
                  <span>Online Live Stream</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-rose-300" />
                  <span>{event.venueName || event.address}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Organizer Info Box */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-base">
                {event.organizerName.charAt(0)}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Organized by
                </span>
                <span className="text-sm font-bold text-slate-900">{event.organizerName}</span>
                <span className="text-xs text-slate-500 block">{event.organizerEmail}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Host
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">About this Event</h2>
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>

            {/* Tags */}
            <div className="pt-4 flex flex-wrap items-center gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Event Schedule Timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Agenda & Schedule</h2>
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-indigo-100">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-2.5 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white shadow-sm -translate-x-1/2" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {item.time}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speakers Section */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Featured Speakers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60"
                  >
                    <img
                      src={speaker.avatar}
                      alt={speaker.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{speaker.name}</h4>
                      <p className="text-xs text-indigo-600 font-medium">{speaker.role}</p>
                      <p className="text-[11px] text-slate-400">{speaker.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue Location / Online Link Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Location & Access Details
            </h2>
            {event.locationType === 'online' ? (
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
                <Video className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-purple-900">Virtual Stream Event</p>
                  <p className="text-purple-700">
                    Live stream link and access credentials will be delivered to your ticket confirmation immediately
                    after registration.
                  </p>
                  {event.onlineLink && (
                    <p className="font-mono text-purple-600 text-[11px] pt-1">
                      Stream Room: {event.onlineLink}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900">{event.venueName || 'Main Convention Hall'}</p>
                  <p className="text-slate-600">{event.address || 'Address provided upon registration'}</p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Free parking available on site. Please present your digital ticket QR code at Reception.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Ticket Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-6">
            <div>
              <span className="text-xs text-slate-400 font-medium">Ticket Pricing</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatPrice(event.ticketPrice, event.currency)}
                </span>
                {event.ticketPrice > 0 && <span className="text-xs text-slate-400">/ person</span>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{event.availableSeats}</strong> of {event.totalSeats} seats remaining
                </span>
                <span className="font-medium text-slate-400">{seatPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    seatPercentage > 85 ? 'bg-rose-500' : seatPercentage > 60 ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${Math.min(seatPercentage, 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              disabled={isSoldOut}
              className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                isSoldOut
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200 hover:shadow-indigo-300'
              }`}
            >
              <Ticket className="w-4 h-4" />
              {isSoldOut ? 'Sold Out' : event.ticketPrice === 0 ? 'Register for Free' : 'Book Tickets Now'}
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Instant QR ticket pass delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Direct access to event recordings & slides</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Free cancellation up to 24h prior</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        event={event}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={(reg) => {
          setIsBookingOpen(false);
          setConfirmedRegistration(reg);
          fetchEvent();
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

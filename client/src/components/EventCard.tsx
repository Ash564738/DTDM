import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Video, Users, ArrowRight } from 'lucide-react';
import type { EventItem } from '../types';
import { formatDate, formatPrice, getCategoryBadgeClass } from '../utils/formatters';

interface EventCardProps {
  event: EventItem;
  onQuickBook?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onQuickBook }) => {
  const isSoldOut = event.availableSeats <= 0;
  const seatPercentage = Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col">
      {/* Banner & Badges */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm border backdrop-blur-md ${getCategoryBadgeClass(
              event.category
            )}`}
          >
            {event.category}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
              event.ticketPrice === 0
                ? 'bg-emerald-500 text-white'
                : 'bg-white/95 text-indigo-700 backdrop-blur-md border border-white/50'
            }`}
          >
            {formatPrice(event.ticketPrice, event.currency)}
          </span>
        </div>

        {/* Location type badge at bottom left of image */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-xs text-white/90 drop-shadow">
          {event.locationType === 'online' ? (
            <span className="flex items-center gap-1 bg-purple-900/70 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-medium border border-purple-400/30">
              <Video className="w-3 h-3 text-purple-300" /> Online Stream
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700/50 line-clamp-1 max-w-[220px]">
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              {event.venueName || event.address || 'Venue'}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date info */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(event.startDate)}</span>
          </div>

          {/* Title */}
          <Link to={`/events/${event.id}`}>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>
        </div>

        {/* Seats progress & Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {isSoldOut ? (
                <span className="text-rose-600 font-semibold">Sold out</span>
              ) : (
                <span>
                  <strong className="text-slate-800">{event.availableSeats}</strong> seats remaining
                </span>
              )}
            </span>
            <span className="text-[11px] font-medium text-slate-400">{seatPercentage}% booked</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                seatPercentage > 85 ? 'bg-rose-500' : seatPercentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(seatPercentage, 100)}%` }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={`/events/${event.id}`}
              className="flex-1 py-2 px-3 text-center text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-1"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {onQuickBook && !isSoldOut && (
              <button
                onClick={() => onQuickBook(event)}
                className="flex-1 py-2 px-3 text-center text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm shadow-indigo-200"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

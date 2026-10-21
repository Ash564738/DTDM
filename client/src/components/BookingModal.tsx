import React, { useState } from 'react';
import { X, Calendar, MapPin, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { EventItem, Registration } from '../types';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatPrice } from '../utils/formatters';

interface BookingModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registration: Registration) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ event, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [ticketCount, setTicketCount] = useState(1);
  const [attendeeName, setAttendeeName] = useState(user?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [attendeePhone, setAttendeePhone] = useState('+84 901 234 567');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const maxTickets = Math.min(5, event.availableSeats);
  const totalPrice = ticketCount * event.ticketPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const registration = await eventService.registerForEvent({
        eventId: event.id,
        userId: user?.id || 'guest-attendee',
        attendeeName,
        attendeeEmail,
        attendeePhone,
        ticketCount,
        notes,
      });

      // Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas not supported
      }

      onSuccess(registration);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to book tickets. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-200">Ticket Registration</span>
            <h2 className="text-lg font-bold text-white line-clamp-1">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-indigo-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Event Summary */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-medium text-slate-800">{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">
                {event.locationType === 'venue' ? event.venueName || event.address : 'Online Virtual Event'}
              </span>
            </div>
          </div>

          {/* Ticket Quantity Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Number of Tickets</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                  disabled={ticketCount <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-sm text-slate-800">{ticketCount}</span>
                <button
                  type="button"
                  onClick={() => setTicketCount((prev) => Math.min(maxTickets, prev + 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                  disabled={ticketCount >= maxTickets}
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-400">
                (Max {maxTickets} tickets per booking • {event.availableSeats} available)
              </span>
            </div>
          </div>

          {/* Attendee Info Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                placeholder="e.g. Sarah Parker"
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  placeholder="+84 901 234 567"
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Special Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dietary preferences, workshop track interest, etc."
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Pricing summary box */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-indigo-700 font-medium">Total Amount</span>
              <div className="text-xs text-indigo-500">
                {ticketCount} x {formatPrice(event.ticketPrice, event.currency)}
              </div>
            </div>
            <div className="text-xl font-bold text-indigo-900">
              {formatPrice(totalPrice, event.currency)}
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {event.ticketPrice === 0 ? 'Confirm Free Registration' : 'Complete Booking'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Eye, ArrowRight } from 'lucide-react';
import type { Registration } from '../types';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatPrice } from '../utils/formatters';
import { TicketModal } from '../components/TicketModal';

export const MyTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Registration | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchTickets = () => {
    if (!user) return;
    setLoading(true);
    eventService.getMyRegistrations(user.id).then((data) => {
      setRegistrations(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const handleCancelTicket = async (regId: string) => {
    if (!window.confirm('Are you sure you want to cancel this ticket registration? Your seats will be released.')) {
      return;
    }
    setCancellingId(regId);
    try {
      await eventService.cancelRegistration(regId);
      fetchTickets();
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
          <Ticket className="w-4 h-4" />
          <span>My Reservations</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Booked Tickets</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Access your digital passes, view event barcodes, and manage your registrations.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const isCancelled = reg.status === 'cancelled';

            return (
              <div
                key={reg.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                  isCancelled
                    ? 'border-slate-200 bg-slate-50/60 opacity-60'
                    : 'border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                {/* Left side: Thumbnail + Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={reg.eventBanner}
                    alt={reg.eventTitle}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                        {reg.ticketCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-700'
                            : reg.isCheckedIn
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isCancelled ? 'Cancelled' : reg.isCheckedIn ? 'Checked In' : 'Active Pass'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                      {reg.eventTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {formatDate(reg.eventDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {reg.eventLocation}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400">
                      Attendee: <strong className="text-slate-700">{reg.attendeeName}</strong> • {reg.ticketCount}{' '}
                      ticket(s) •{' '}
                      <span className="font-semibold text-indigo-600">
                        {formatPrice(reg.totalAmount, reg.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {!isCancelled && (
                    <button
                      onClick={() => setSelectedTicket(reg)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View QR Ticket
                    </button>
                  )}

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancelTicket(reg.id)}
                      disabled={cancellingId === reg.id}
                      className="px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                    >
                      {cancellingId === reg.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}

                  {isCancelled && (
                    <span className="text-xs text-slate-400 italic">Reservation Cancelled</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">You haven't booked any tickets yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our curated selection of conferences, live concerts, and workshops to book your first pass!
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Explore Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Ticket Modal */}
      <TicketModal
        registration={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
};

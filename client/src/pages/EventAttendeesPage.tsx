import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle2, Clock, Search, Download, Mail, Phone } from 'lucide-react';
import type { EventItem, Registration } from '../types';
import { eventService } from '../services/api';
import { formatDate, formatPrice } from '../utils/formatters';

export const EventAttendeesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [attendees, setAttendees] = useState<Registration[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    const [evt, atts] = await Promise.all([
      eventService.getEventById(id),
      eventService.getEventAttendees(id),
    ]);
    setEvent(evt);
    setAttendees(atts);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleToggleCheckIn = async (regId: string) => {
    await eventService.toggleAttendeeCheckIn(regId);
    loadData();
  };

  const handleExportCSV = () => {
    if (!attendees.length) return;
    const headers = ['Ticket Code', 'Name', 'Email', 'Phone', 'Quantity', 'Amount', 'Checked In', 'Registered At'];
    const rows = attendees.map((a) => [
      a.ticketCode,
      `"${a.attendeeName}"`,
      a.attendeeEmail,
      a.attendeePhone,
      a.ticketCount,
      a.totalAmount,
      a.isCheckedIn ? 'YES' : 'NO',
      a.registeredAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attendees-${event?.slug || 'event'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAttendees = attendees.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.attendeeName.toLowerCase().includes(q) ||
      a.attendeeEmail.toLowerCase().includes(q) ||
      a.ticketCode.toLowerCase().includes(q)
    );
  });

  const checkedInCount = attendees.filter((a) => a.isCheckedIn).length;
  const totalTickets = attendees.reduce((sum, a) => sum + a.ticketCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div>
        <Link
          to="/organizer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Organizer Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Attendee Management</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{event?.title}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={attendees.length === 0}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export to CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Registered</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalTickets} Tickets</div>
            <span className="text-[11px] text-slate-500 font-medium">Across {attendees.length} orders</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Checked In</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{checkedInCount} Attendees</div>
            <span className="text-[11px] text-emerald-600 font-medium">
              {attendees.length ? Math.round((checkedInCount / attendees.length) * 100) : 0}% check-in rate
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Pending Check-in</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {attendees.length - checkedInCount} Guests
            </div>
            <span className="text-[11px] text-amber-600 font-medium">Awaiting arrival</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Attendees Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ticket code..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-400">
            Showing {filteredAttendees.length} of {attendees.length} records
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading attendee records...</div>
        ) : filteredAttendees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Ticket Code</th>
                  <th className="py-3.5 px-4">Attendee Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Qty & Price</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                  <th className="py-3.5 px-6 text-right">Check-in Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttendees.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {att.ticketCode}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{att.attendeeName}</div>
                      {att.notes && <div className="text-[11px] text-slate-400 italic">"{att.notes}"</div>}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{att.attendeeEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{att.attendeePhone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{att.ticketCount} ticket(s)</span>
                      <div className="text-[11px] text-indigo-600 font-medium">
                        {formatPrice(att.totalAmount, att.currency)}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {formatDate(att.registeredAt)}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleToggleCheckIn(att.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                          att.isCheckedIn
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${att.isCheckedIn ? 'text-emerald-600' : 'text-slate-400'}`}
                        />
                        {att.isCheckedIn ? 'Checked In' : 'Mark Check-in'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-500">
            No attendees found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

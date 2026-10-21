import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Edit,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import type { DashboardStats, EventItem } from '../types';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatPrice, getCategoryBadgeClass } from '../utils/formatters';

export const OrganizerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const [statsData, eventsData] = await Promise.all([
      eventService.getDashboardStats(user.id),
      eventService.getEvents(),
    ]);
    setStats(statsData);
    setEvents(eventsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleDelete = async (eventId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete event "${title}"?`)) {
      await eventService.deleteEvent(eventId);
      loadData();
    }
  };

  const handleToggleStatus = async (event: EventItem) => {
    const newStatus = event.status === 'published' ? 'draft' : 'published';
    await eventService.updateEvent(event.id, { status: newStatus });
    loadData();
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo events and registrations back to defaults?')) {
      eventService.resetData();
      loadData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Organizer Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Management Dashboard</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Monitor ticketing sales, track live attendee attendance, and manage event schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDemo}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            title="Reset sample events and tickets"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Demo Data
          </button>
          <Link
            to="/organizer/events/new"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-md shadow-indigo-200"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Event
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Hosted Events</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalEvents ?? 0}</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">All categories</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Active / Published</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{stats?.activeEvents ?? 0}</div>
            <span className="text-[11px] text-indigo-500 font-medium mt-1 inline-block">Currently live</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Attendees</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalRegistrations ?? 0}</div>
            <span className="text-[11px] text-purple-600 font-medium mt-1 inline-block">Tickets confirmed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Gross Revenue</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {formatPrice(stats?.totalRevenue ?? 0)}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium mt-1 inline-block">Ticketing receipts</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Events Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Events List</h2>
            <p className="text-xs text-slate-400">View and update events created under your organizer account.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {events.length} Total
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading your events...</div>
        ) : events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Event Details</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Seats Sold</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => {
                  const seatsSold = evt.totalSeats - evt.availableSeats;
                  const percentSold = Math.round((seatsSold / evt.totalSeats) * 100);

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.bannerUrl}
                            alt={evt.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="max-w-xs">
                            <Link
                              to={`/events/${evt.id}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 text-xs sm:text-sm"
                            >
                              {evt.title}
                            </Link>
                            <span className="text-[11px] text-slate-400 block line-clamp-1">
                              {evt.venueName || evt.address || 'Online virtual stream'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {formatDate(evt.startDate)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeClass(
                            evt.category
                          )}`}
                        >
                          {evt.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-800">
                        {formatPrice(evt.ticketPrice, evt.currency)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">
                            {seatsSold} / {evt.totalSeats}
                          </span>
                          <span className="text-[10px] text-slate-400">({percentSold}%)</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(evt)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            evt.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {evt.status}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/organizer/events/${evt.id}/attendees`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Manage Attendees & Check-in"
                          >
                            <Users className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/organizer/events/${evt.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(evt.id, evt.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 space-y-3">
            <p>You haven't created any events yet.</p>
            <Link
              to="/organizer/events/new"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
            >
              Create your first event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

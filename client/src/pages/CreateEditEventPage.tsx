import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { EventCategory, LocationType } from '../types';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PRESET_BANNERS = [
  { label: 'Cloud Tech', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Coding Workshop', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Acoustic Concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Business Mixer', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80' },
];

export const CreateEditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // Form fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('Technology');
  const [bannerUrl, setBannerUrl] = useState(PRESET_BANNERS[0].url);
  const [locationType, setLocationType] = useState<LocationType>('venue');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [onlineLink, setOnlineLink] = useState('');
  const [startDate, setStartDate] = useState('2026-11-25T09:00');
  const [endDate, setEndDate] = useState('2026-11-25T17:00');
  const [ticketPrice, setTicketPrice] = useState<number>(0);
  const [totalSeats, setTotalSeats] = useState<number>(100);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [tagsInput, setTagsInput] = useState('Tech, Docker, Cloud');

  useEffect(() => {
    if (isEditing && id) {
      eventService.getEventById(id).then((event) => {
        if (event) {
          setTitle(event.title);
          setShortDescription(event.shortDescription);
          setDescription(event.description);
          setCategory(event.category);
          setBannerUrl(event.bannerUrl);
          setLocationType(event.locationType);
          setVenueName(event.venueName || '');
          setAddress(event.address || '');
          setOnlineLink(event.onlineLink || '');
          setStartDate(event.startDate.substring(0, 16));
          setEndDate(event.endDate.substring(0, 16));
          setTicketPrice(event.ticketPrice);
          setTotalSeats(event.totalSeats);
          setStatus(event.status === 'draft' ? 'draft' : 'published');
          setTagsInput(event.tags.join(', '));
        }
        setInitialLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const eventPayload = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription,
      description,
      category,
      bannerUrl,
      organizerId: user?.id || 'user-organizer-1',
      organizerName: user?.organization || user?.name || 'EventFlow Host',
      organizerEmail: user?.email || 'host@eventflow.cloud',
      locationType,
      venueName: locationType === 'venue' ? venueName : undefined,
      address: locationType === 'venue' ? address : undefined,
      onlineLink: locationType === 'online' ? onlineLink : undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      ticketPrice: Number(ticketPrice),
      currency: 'USD',
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
      status,
      tags,
    };

    try {
      if (isEditing && id) {
        await eventService.updateEvent(id, eventPayload);
      } else {
        await eventService.createEvent(eventPayload);
      }
      navigate('/organizer');
    } catch (err) {
      console.error(err);
      alert('Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
        <p className="text-xs text-slate-500">Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/organizer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Event' : 'Host a New Event'}
          </h1>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-2">
            1. Event Overview
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vietnam Cloud & DevOps Summit 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Technology">Technology</option>
                <option value="Music & Concerts">Music & Concerts</option>
                <option value="Business & Networking">Business & Networking</option>
                <option value="Workshops & Education">Workshops & Education</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
                <option value="Arts & Culture">Arts & Culture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="published">Published (Public)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description (Catchphrase) *</label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A brief 1-sentence teaser for cards and previews"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Description & Agenda</label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description, bullet points, workshop prerequisites..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Section 2: Banner Image */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-2">
            2. Banner Image
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              required
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">Or choose a quick preset banner:</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_BANNERS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setBannerUrl(preset.url)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    bannerUrl === preset.url
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {bannerUrl && (
            <div className="aspect-[21/9] max-h-48 rounded-2xl overflow-hidden border border-slate-200 mt-2">
              <img src={bannerUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Section 3: Date, Time & Venue */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-2">
            3. Date, Time & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Event Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="locationType"
                  value="venue"
                  checked={locationType === 'venue'}
                  onChange={() => setLocationType('venue')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                In-Person Venue
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="locationType"
                  value="online"
                  checked={locationType === 'online'}
                  onChange={() => setLocationType('online')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Online Stream (Meet / Zoom / YouTube)
              </label>
            </div>
          </div>

          {locationType === 'venue' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Name</label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Saigon Innovation Hub"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 273 An Duong Vuong, Ward 3, District 5"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Online Stream Link</label>
              <input
                type="url"
                required
                value={onlineLink}
                onChange={(e) => setOnlineLink(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Section 4: Tickets & Capacity */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-2">
            4. Ticketing & Capacity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ticket Price (USD) <span className="text-slate-400 font-normal">(0 = Free)</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Capacity / Seats</label>
              <input
                type="number"
                min="1"
                required
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Docker, Render, React, NodeJS, PostgreSQL"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/organizer"
            className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Event...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Event' : 'Publish Event'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

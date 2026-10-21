import axios from 'axios';
import type { DashboardStats, EventItem, Registration } from '../types';
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const STORAGE_KEYS = {
  EVENTS: 'ems_mock_events',
  REGISTRATIONS: 'ems_mock_registrations',
};

function getStoredEvents(): EventItem[] {
  const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_EVENTS;
  }
}

function saveStoredEvents(events: EventItem[]) {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

function getStoredRegistrations(): Registration[] {
  const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
    return INITIAL_REGISTRATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_REGISTRATIONS;
  }
}

function saveStoredRegistrations(registrations: Registration[]) {
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
}

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const eventService = {
  async getEvents(params?: { category?: string; search?: string; status?: string }): Promise<EventItem[]> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<EventItem[]>('/events', { params });
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to local data store', err);
      }
    }

    await delay(250);
    let events = getStoredEvents();

    if (params?.status) {
      events = events.filter((e) => e.status === params.status);
    }

    if (params?.category && params.category !== 'All') {
      events = events.filter((e) => e.category === params.category);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          (e.venueName && e.venueName.toLowerCase().includes(q))
      );
    }

    return events;
  },

  async getEventById(id: string): Promise<EventItem | null> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<EventItem>(`/events/${id}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend unavailable for event ${id}, falling back to local mock data`, err);
      }
    }

    await delay(150);
    const events = getStoredEvents();
    return events.find((e) => e.id === id) || null;
  },

  async createEvent(data: Omit<EventItem, 'id' | 'createdAt'>): Promise<EventItem> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.post<EventItem>('/events', data);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable for createEvent, using local store', err);
      }
    }

    await delay(350);
    const events = getStoredEvents();
    const newEvent: EventItem = {
      ...data,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    events.unshift(newEvent);
    saveStoredEvents(events);
    return newEvent;
  },

  async updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.put<EventItem>(`/events/${id}`, updates);
        return response.data;
      } catch (err) {
        console.warn(`Backend unavailable for updateEvent ${id}, using local store`, err);
      }
    }

    await delay(300);
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');

    const updated = { ...events[index], ...updates };
    events[index] = updated;
    saveStoredEvents(events);
    return updated;
  },

  async deleteEvent(id: string): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.delete(`/events/${id}`);
        return;
      } catch (err) {
        console.warn(`Backend unavailable for deleteEvent ${id}, using local store`, err);
      }
    }

    await delay(250);
    const events = getStoredEvents().filter((e) => e.id !== id);
    saveStoredEvents(events);
  },

  async registerForEvent(payload: {
    eventId: string;
    userId: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone: string;
    ticketCount: number;
    notes?: string;
  }): Promise<Registration> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.post<Registration>(`/events/${payload.eventId}/register`, payload);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable for registerForEvent, using local store', err);
      }
    }

    await delay(400);
    const events = getStoredEvents();
    const event = events.find((e) => e.id === payload.eventId);
    if (!event) throw new Error('Event not found');

    if (event.availableSeats < payload.ticketCount) {
      throw new Error('Not enough tickets available!');
    }

    event.availableSeats -= payload.ticketCount;
    saveStoredEvents(events);

    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      ticketCode: `EMS-2026-${randomSuffix}`,
      eventId: event.id,
      eventTitle: event.title,
      eventBanner: event.bannerUrl,
      eventDate: event.startDate,
      eventLocation: event.locationType === 'venue' ? (event.venueName || event.address || 'Venue') : 'Online Event',
      userId: payload.userId,
      attendeeName: payload.attendeeName,
      attendeeEmail: payload.attendeeEmail,
      attendeePhone: payload.attendeePhone,
      ticketCount: payload.ticketCount,
      totalAmount: payload.ticketCount * event.ticketPrice,
      currency: event.currency,
      status: 'confirmed',
      isCheckedIn: false,
      registeredAt: new Date().toISOString(),
      notes: payload.notes,
    };

    const regs = getStoredRegistrations();
    regs.unshift(newReg);
    saveStoredRegistrations(regs);
    return newReg;
  },

  async getMyRegistrations(userId: string): Promise<Registration[]> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<Registration[]>('/registrations/my');
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable for getMyRegistrations, using local store', err);
      }
    }

    await delay(200);
    const regs = getStoredRegistrations();
    return regs.filter((r) => r.userId === userId);
  },

  async cancelRegistration(regId: string): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.delete(`/registrations/${regId}`);
        return;
      } catch (err) {
        console.warn(`Backend unavailable for cancelRegistration, using local store`, err);
      }
    }

    await delay(250);
    const regs = getStoredRegistrations();
    const reg = regs.find((r) => r.id === regId);
    if (reg && reg.status !== 'cancelled') {
      reg.status = 'cancelled';
      const events = getStoredEvents();
      const event = events.find((e) => e.id === reg.eventId);
      if (event) {
        event.availableSeats += reg.ticketCount;
        saveStoredEvents(events);
      }
      saveStoredRegistrations(regs);
    }
  },

  async getEventAttendees(eventId: string): Promise<Registration[]> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<Registration[]>(`/events/${eventId}/registrations`);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable for getEventAttendees, using local store', err);
      }
    }

    await delay(200);
    const regs = getStoredRegistrations();
    return regs.filter((r) => r.eventId === eventId);
  },

  async toggleAttendeeCheckIn(regId: string): Promise<Registration> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.patch<Registration>(`/registrations/${regId}/check-in`);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable for toggleAttendeeCheckIn, using local store', err);
      }
    }

    await delay(150);
    const regs = getStoredRegistrations();
    const reg = regs.find((r) => r.id === regId);
    if (!reg) throw new Error('Registration not found');

    reg.isCheckedIn = !reg.isCheckedIn;
    saveStoredRegistrations(regs);
    return reg;
  },

  async getDashboardStats(organizerId: string): Promise<DashboardStats> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<DashboardStats>('/organizer/stats');
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable for getDashboardStats, using local store', err);
      }
    }

    await delay(200);
    const events = getStoredEvents().filter((e) => e.organizerId === organizerId);
    const eventIds = new Set(events.map((e) => e.id));
    const regs = getStoredRegistrations().filter((r) => eventIds.has(r.eventId) && r.status === 'confirmed');

    const totalRevenue = regs.reduce((sum, r) => sum + r.totalAmount, 0);
    const totalRegistrations = regs.reduce((sum, r) => sum + r.ticketCount, 0);
    const activeEvents = events.filter((e) => e.status === 'published').length;

    return {
      totalEvents: events.length,
      activeEvents,
      totalRegistrations,
      totalRevenue,
    };
  },

  resetData(): void {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
  },
};

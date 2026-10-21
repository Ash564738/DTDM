export type UserRole = 'attendee' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
}

export type EventCategory =
  | 'Technology'
  | 'Music & Concerts'
  | 'Business & Networking'
  | 'Workshops & Education'
  | 'Sports & Fitness'
  | 'Arts & Culture';

export type EventStatus = 'draft' | 'published' | 'completed' | 'cancelled';
export type LocationType = 'venue' | 'online';

export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: EventCategory;
  bannerUrl: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  locationType: LocationType;
  venueName?: string;
  address?: string;
  onlineLink?: string;
  startDate: string; // ISO String
  endDate: string; // ISO String
  ticketPrice: number; // 0 means Free
  currency: string;
  totalSeats: number;
  availableSeats: number;
  status: EventStatus;
  tags: string[];
  speakers?: Speaker[];
  schedule?: ScheduleItem[];
  createdAt: string;
}

export interface Registration {
  id: string;
  ticketCode: string;
  eventId: string;
  eventTitle: string;
  eventBanner: string;
  eventDate: string;
  eventLocation: string;
  userId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  ticketCount: number;
  totalAmount: number;
  currency: string;
  status: 'confirmed' | 'cancelled';
  isCheckedIn: boolean;
  registeredAt: string;
  notes?: string;
}

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalRegistrations: number;
  totalRevenue: number;
}

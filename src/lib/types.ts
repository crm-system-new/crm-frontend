export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  roles: string[];
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  stage: string;
  owner_id: string;
  score: number;
  notes: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  contact: {
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  owner_id: string;
}

export interface Opportunity {
  id: string;
  title: string;
  customer_id: string;
  owner_id: string;
  amount: number;
  currency: string;
  stage: string;
  close_date: string;
  probability: number;
  lost_reason: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  channel: string;
  segment_id: string;
  scheduled_at: string;
  sent_count: number;
  open_rate: number;
  click_rate: number;
}

export interface Segment {
  id: string;
  name: string;
  criteria: string;
  subscriber_count: number;
}

export interface Subscriber {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  preferences: Record<string, boolean>;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  customer_id: string;
  owner_id: string;
  sla_id: string;
  due_at: string;
  resolved_at: string;
}

export interface Comment {
  id: string;
  ticket_id: string;
  author_id: string;
  body: string;
  internal: boolean;
  created_at: string;
}

export interface SLA {
  id: string;
  name: string;
  priority: string;
  response_time_hours: number;
  resolution_time_hours: number;
}

export interface DashboardData {
  total_leads: number;
  total_customers: number;
  open_tickets: number;
  active_campaigns: number;
  recent_leads: Lead[];
  recent_tickets: Ticket[];
}

export interface Customer360 {
  customer: Customer;
  opportunities: Opportunity[];
  tickets: Ticket[];
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface AuthResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

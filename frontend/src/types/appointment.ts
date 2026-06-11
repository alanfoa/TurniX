export interface Service {
  id: number;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Professional {
  id: number;
  name: string;
  specialty?: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface AvailableSlotsResponse {
  date: string;
  professionalId: number;
  slots: TimeSlot[];
}

export interface Appointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: number;
  notes?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  user: { id: number; name: string; email: string };
  professional: { id: number; name: string };
  service: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

export type CreateAppointmentPayload = {
  date: string;
  startTime: string;
  professionalId: number;
  serviceId: number;
  notes?: string;
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

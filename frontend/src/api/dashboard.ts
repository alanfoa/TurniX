import apiClient from "./client";
import type {
  Service, Professional, Appointment,
} from "../types/appointment";

// --- Dashboard Stats ---
export interface DashboardStats {
  todayAppointments: number;
  todayRevenue: number;
  newClientsThisWeek: number;
  confirmationRate: number;
  weeklyAppointments: { day: string; confirmados: number; pendientes: number; cancelados: number }[];
  monthlyRevenue: { date: string; amount: number }[];
  topServices: { name: string; count: number; percentage: number; revenue: number }[];
  professionalPerformance: { name: string; appointments: number; revenue: number }[];
  todayTimeline: { time: string; client: string; service: string; status: string }[];
  upcomingAppointments: Appointment[];
}

export async function fetchDashboardStats(range: "today" | "week" | "month" = "week"): Promise<DashboardStats> {
  const res = await apiClient.get<DashboardStats>("/dashboard/stats", {
    params: { range },
  });
  return res.data;
}

// --- Services ---
export async function createService(data: { name: string; description?: string; durationMinutes: number; price: number }): Promise<Service> {
  const res = await apiClient.post<Service>("/services", data);
  return res.data;
}
export async function updateService(id: number, data: Partial<Service>): Promise<Service> {
  const res = await apiClient.patch<Service>(`/services/${id}`, data);
  return res.data;
}
export async function deleteService(id: number): Promise<void> {
  await apiClient.delete(`/services/${id}`);
}

// --- Professionals ---
export async function createProfessional(data: { name: string; specialty?: string; description?: string }): Promise<Professional> {
  const res = await apiClient.post<Professional>("/professionals", data);
  return res.data;
}
export async function updateProfessional(id: number, data: Partial<Professional>): Promise<Professional> {
  const res = await apiClient.patch<Professional>(`/professionals/${id}`, data);
  return res.data;
}
export async function deleteProfessional(id: number): Promise<void> {
  await apiClient.delete(`/professionals/${id}`);
}

// --- Availability ---
export interface AvailabilityBlock {
  id: number;
  professionalId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}
export async function fetchAvailability(professionalId: number): Promise<AvailabilityBlock[]> {
  const res = await apiClient.get<AvailabilityBlock[]>(`/availability/professional/${professionalId}`);
  return res.data;
}
export async function createAvailability(data: { professionalId: number; dayOfWeek: number; startTime: string; endTime: string }): Promise<AvailabilityBlock> {
  const res = await apiClient.post<AvailabilityBlock>("/availability", data);
  return res.data;
}
export async function deleteAvailability(id: number): Promise<void> {
  await apiClient.delete(`/availability/${id}`);
}

// --- Appointments ---
export async function updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
  const res = await apiClient.patch<Appointment>(`/appointments/${id}/status`, { status });
  return res.data;
}

// --- Users ---
export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
}
export async function fetchUsers(): Promise<UserRecord[]> {
  const res = await apiClient.get<UserRecord[]>("/users");
  return res.data;
}

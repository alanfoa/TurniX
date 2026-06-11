import apiClient from "./client";
import type { Service, Professional, AvailableSlotsResponse, Appointment, CreateAppointmentPayload, PaginatedResponse } from "../types/appointment";

export async function fetchServices(): Promise<Service[]> {
  const res = await apiClient.get<Service[]>("/services");
  return res.data;
}

export async function fetchProfessionals(): Promise<Professional[]> {
  const res = await apiClient.get<Professional[]>("/professionals");
  return res.data;
}

export async function fetchAvailableSlots(professionalId: number, date: string): Promise<AvailableSlotsResponse> {
  const res = await apiClient.get<AvailableSlotsResponse>("/appointments/available", {
    params: { professionalId, date },
  });
  return res.data;
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
  const res = await apiClient.post<Appointment>("/appointments", payload);
  return res.data;
}

export async function fetchMyAppointments(page = 1, limit = 20): Promise<PaginatedResponse<Appointment>> {
  const res = await apiClient.get<PaginatedResponse<Appointment>>("/appointments", {
    params: { page, limit },
  });
  return res.data;
}

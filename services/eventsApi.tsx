// src/services/eventsApi.ts
import { HomePageEventDTO } from '@/app/types/HomePageEventDTO';
import { api } from './api';
import { EventDetailsDTO } from '@/app/types/EventDetailsDTO';


export interface Category {
  id: number;
  title: string;
}

// get paginated events with optional categoryId
export const getHomePageEvents = async (page: number, size: number) => {
  const params: any = { page, size };
  const response = await api.get<HomePageEventDTO[]>('/user/homepage', { params });
  return response.data;
};

// get all categories
export const getCategories = async () => {
  const response = await api.get<Category[]>('/category/');
  return response.data;
};

// get Event Details
export const getEventDetails = async (id: number) => {
  const response = await api.get<EventDetailsDTO>(`/user/event/${id}`);
  return response.data;
};
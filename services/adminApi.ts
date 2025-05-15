import { api } from "./api";

export const getAdminDashboard = async (page: number, size: number) => {
  const res = await api.get('/admin/dashboard', {
    params: { page, size },
  });
  return res.data;
};

export async function getAdminEventDetails(id: string | string[]) {
  const res = await api.get(`/admin/event/${id}`);
  if (!res) throw new Error('Failed to fetch event');
  return res.data;
}

export async function deleteEventById(id: number) {
  const res = await api.delete(`/admin/control-panel/${id}`);
  if (!res) throw new Error('Failed to delete event');
}

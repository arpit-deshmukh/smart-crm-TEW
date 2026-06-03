import api from "./api";

export const getPendingRequests = async () => {
  const response = await api.get("/admin-requests");
  return response.data;
};

export const approveRequest = async (id) => {
  const response = await api.put(`/admin-requests/${id}/approve`);
  return response.data;
};

export const denyRequest = async (id) => {
  const response = await api.put(`/admin-requests/${id}/deny`);
  return response.data;
};
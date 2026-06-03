import api from "./api";

export const getAllUsers = async () => {
  const response = await api.get("/admin-users");
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.put(`/admin-users/${id}/role`, { role });
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await api.put(`/admin-users/${id}/toggle-status`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin-users/${id}`);
  return response.data;
};
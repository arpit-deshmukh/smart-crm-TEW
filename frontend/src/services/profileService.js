import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await api.put("/profile", payload);
  return response.data;
};

export const updatePassword = async (payload) => {
  const response = await api.put("/profile/password", payload);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/profile");
  return response.data;
};
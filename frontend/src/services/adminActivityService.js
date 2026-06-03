import api from "./api";

export const getAllActivities = async () => {
  const response = await api.get("/admin-activity");
  return response.data;
};
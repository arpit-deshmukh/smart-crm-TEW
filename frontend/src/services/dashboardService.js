import api from "./api";

export const getUserDashboardSummary = async () => {
  const response = await api.get("/dashboard/user-summary");
  return response.data;
};
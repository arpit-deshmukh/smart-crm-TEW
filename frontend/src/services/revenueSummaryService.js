import api from "./api";

export const getRevenueSummary = async () => {
  const response = await api.get("/revenue-summary");
  return response.data;
};
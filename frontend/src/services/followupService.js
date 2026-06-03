import api from "./api";

export const createFollowup = async (followupData) => {
  const response = await api.post("/followups", followupData);
  return response.data;
};

export const convertLeadToFollowup = async (payload) => {
  const response = await api.post("/followups/convert-from-lead", payload);
  return response.data;
};

export const getAllFollowups = async () => {
  const response = await api.get("/followups");
  return response.data;
};

export const getFollowupById = async (id) => {
  const response = await api.get(`/followups/${id}`);
  return response.data;
};

export const updateFollowup = async (id, followupData) => {
  const response = await api.put(`/followups/${id}`, followupData);
  return response.data;
};

export const deleteFollowup = async (id) => {
  const response = await api.delete(`/followups/${id}`);
  return response.data;
};
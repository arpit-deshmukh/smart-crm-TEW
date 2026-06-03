import api from "./api";

export const sendBulkFollowupMail = async (payload) => {
  const response = await api.post("/followup-mails/send-bulk", payload);
  return response.data;
};
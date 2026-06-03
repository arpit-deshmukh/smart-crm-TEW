import api from "./api";

export const sendBulkLeadMail = async (payload) => {
  const response = await api.post("/lead-mails/send-bulk", payload);
  return response.data;
};
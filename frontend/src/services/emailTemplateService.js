import api from "./api";

export const createEmailTemplate = async (templateData) => {
  const response = await api.post("/email-templates", templateData);
  return response.data;
};

export const getAllEmailTemplates = async () => {
  const response = await api.get("/email-templates");
  return response.data;
};

export const getEmailTemplateById = async (id) => {
  const response = await api.get(`/email-templates/${id}`);
  return response.data;
};

export const updateEmailTemplate = async (id, templateData) => {
  const response = await api.put(`/email-templates/${id}`, templateData);
  return response.data;
};

export const deleteEmailTemplate = async (id) => {
  const response = await api.delete(`/email-templates/${id}`);
  return response.data;
};
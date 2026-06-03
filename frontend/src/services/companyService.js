import api from "./api";

export const createCompany = async (companyData) => {
  const response = await api.post("/companies", companyData);
  return response.data;
};

export const getAllCompanies = async () => {
  const response = await api.get("/companies");
  return response.data;
};

export const getCompanyById = async (id) => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

export const updateCompany = async (id, companyData) => {
  const response = await api.put(`/companies/${id}`, companyData);
  return response.data;
};

export const deleteCompany = async (id) => {
  const response = await api.delete(`/companies/${id}`);
  return response.data;
};
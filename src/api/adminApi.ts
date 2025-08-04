import axios from "axios";

const API_BASE_URL = "http://172.16.0.60:8002";

export const getAllUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/get-users`);
  return response.data;
};

export const getUserTransactions = async (userId: number) => {
  const response = await axios.get(`${API_BASE_URL}/get-transaction`, {
    params: { id: userId },
  });
  return response.data;
};

export const generateQR = async (name: string, amount: number) => {
  const response = await axios.post(`${API_BASE_URL}/generate-qr`, {
    name,
    amount,
  }, {
    responseType: 'blob'
  });
  return response.data;
};

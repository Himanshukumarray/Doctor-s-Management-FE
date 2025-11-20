import api from "./axiosInstance";

export const loginApi = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });

  // Save token + role
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);

  return data; // { token, role, name }
};

import api from "./api";

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const register = (name: string, email: string, password: string) =>
  api.post("/auth/register", { name, email, password });

export const refreshToken = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  return api.post("/auth/refresh", { refreshToken });
};


export const logout = () =>{
    const refreshToken = localStorage.getItem("refreshToken");
  return api.post("/auth/logout", { refreshToken });
}


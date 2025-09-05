import api from "../lib/axios";

export const registerUser = (data: any) => api.post("/api/auth/register", data);
export const loginUser = (data: any) => api.post("/api/auth/login", data);
export const loginWithGoogle = (tokenId: string) => api.post("/api/auth/google", { tokenId });

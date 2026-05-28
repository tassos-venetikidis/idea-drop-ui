import api from "#/lib/axios";

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to register";
    throw new Error(message);
  }
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to authenticate";
    throw new Error(message);
  }
}

export async function logoutUser() {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to logout";
    throw new Error(message);
  }
}

export async function refreshAccessToken() {
  try {
    const res = await api.post("/auth/refresh");
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Failed to refresh access token";
    throw new Error(message);
  }
}

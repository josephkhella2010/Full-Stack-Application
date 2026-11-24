import axios from "axios";

const baseURL = "http://localhost:5020/api";
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");

      // Notify the React application that the session has expired.
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  },
);

interface ApiRequest {
  api: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

export const apiRequest = async ({
  api,
  endpoint = "",
  method = "GET",
  token,
  body,
  headers,
  params,
}: ApiRequest) => {
  const response = await axiosInstance({
    url: `/${api}${endpoint}`,
    method,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: body,
    params,
  });

  return response.data;
};

/* 
import axios from "axios";

const baseURL = "http://localhost:5020/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  },
);

interface ApiRequest {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

export const apiRequest = async ({
  endpoint = "",
  method = "GET",
  token,
  body,
  headers,
  params,
}: ApiRequest) => {
  const response = await axiosInstance({
    url: endpoint,
    method,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: body,
    params,
  });

  return response.data;
};
 */

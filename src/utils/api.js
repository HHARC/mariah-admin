import axios from "axios";

export const api = axios.create({
    // baseURL: "http://localhost:8080/", // Development URL
    // baseURL: "https://api.artspiree.com/", // Old Production URL
    baseURL: "https://mariah-universe-backend.vercel.app/", // New Backend URL
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        if (response.data?.data?.accessToken) {
            localStorage.setItem("accessToken", response.data.data.accessToken);
        }
        return response;
    },
    async (err) => {
        if (err.response) {
            const status = err.response.status;

            if (status === 401) {
                try {
                    const refreshResponse = await api.post("api/auth/refresh-token");

                    if (refreshResponse.data?.data?.accessToken) {
                        localStorage.setItem("accessToken", refreshResponse.data.data.accessToken);

                        const originalRequest = err.config;
                        originalRequest.headers["Authorization"] = `Bearer ${refreshResponse.data.data.accessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshErr) {
                    console.error("Failed to refresh token:", refreshErr);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("authUser");
                    window.location.href = "/login";
                }
            } else {
                console.error("Error:", err.response.data);
            }
        } else {
            console.error("Network or other error:", err);
        }
        return Promise.reject(err);
    }
);

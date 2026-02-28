import env from "@/env";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${env.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const {data} = await response.json();
    localStorage.setItem("authToken", data.token);
    return data;
  } catch (error) {
    return {
      message: "Login Failed",
      data: error,
    };
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("authToken");
  return !token;
}

export const logoutUser = (): void => {
  localStorage.removeItem("authToken");
};

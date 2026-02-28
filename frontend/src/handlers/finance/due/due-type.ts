import env from "@/env";

export interface IDueType {
  id?: number;
  name?: string;
  amount?: string;
}

export interface IEditDueTypePayload {
  id: number;
  payload: Omit<IDueType, "id">;
}

export const getDueTypes = async () => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/due-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch due types");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching due types:", error);
    throw error;
  }
};

export const getDueTypeById = async (id: number) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/due-types/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch due type");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching due type:", error);
  }
};

export const createDueType = async (payload: Omit<IDueType, "id">) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/due-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create due type");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const editDueType = async (dataPayload: IEditDueTypePayload) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/due-types/${dataPayload.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(dataPayload.payload),
    });

    if (!response.ok) {
      throw new Error("Failed to edit due type");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing due type:", error);
    throw error;
  }
};

export const deleteDueType = async (id: number) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/due-types/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete due type");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting due type:", error);
    throw error;
  }
};

import env from "@/env";

export interface IResident {
  id?: number;
  name?: string;
  photo?: string;
  mobile_number?: string;
  marital_status?: boolean;
  occupant_status?: string;
}

export interface IEditResidentPayload {
  id: number;
  payload: IResident;
}

export const getResidents = async (): Promise<IResident[]> => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/residents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch residents");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const getResidentById = async (
  id: number,
): Promise<IResident | null> => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/residents/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch resident");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const createResident = async (payload) => {
  const jwt = localStorage.getItem("authToken");
  console.log('fet', payload);
  
  try {
    const response = await fetch(`${env.baseUrl}/residents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create resident");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const editResident = async (editPayload: IEditResidentPayload) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/residents/${editPayload.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify(editPayload.payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update resident");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteResident = async (id: number) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/residents/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete resident");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

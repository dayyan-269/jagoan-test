import env from "@/env";

export interface IResident {
  id: number;
  name: string;
  photo?: string;
  mobile_number?: string;
  marital_status?: string;
  occupant_status?: string;
}

export interface IResidentPayload {
  name: string;
  photo?: File;
  mobile_number?: string;
  marital_status?: string;
  occupant_status?: string;
}

export interface IEditResidentPayload {
  id: string;
  payload: Omit<IResident, "id" | "photo">;
}

interface IResidentHouse {
  id: number;
  payment_date: string;
  payment_amount: string;
  payment_status: string;
  description: string;
}

interface IResidentDue {
  id: number;
  date: string;
  description?: string;
  due_type: {
    name: string;
    amount: string;
  };
}
export interface IResidentHistory {
  due: IResidentDue[];
  house: IResidentHouse[];
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

export const getOccupiedResidents = async (): Promise<IResident[]> => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/residents-occupied`, {
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

export const getResidentHistory = async (
  id?: number,
): Promise<IResidentHistory | undefined> => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/residents/${id}/history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get resident's history");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const createResident = async (payload: Omit<IResidentPayload, "id">) => {
  const jwt = localStorage.getItem("authToken");
  const finalData = new FormData();

  finalData.append("name", payload.name);

  if (payload.mobile_number !== null && payload.mobile_number !== undefined) {
    finalData.append("mobile_number", payload.mobile_number);
  }

  if (payload.marital_status !== null && payload.marital_status !== undefined) {
    finalData.append("marital_status", payload.marital_status);
  }

  if (
    payload.occupant_status !== null &&
    payload.occupant_status !== undefined
  ) {
    finalData.append("occupant_status", payload.occupant_status);
  }

  if (payload.photo instanceof File) {
    finalData.append("photo", payload.photo);
  }

  try {
    const response = await fetch(`${env.baseUrl}/residents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: finalData,
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

import env from "@/env";

export interface ISpendingType {
  id: number
  name: string;
  amount: string;
}

export interface IEditSpendingTypePayload {
  id: number;
  payload: Omit<ISpendingType, "id">;
}

export const getSpendingTypes = async (): Promise<ISpendingType[] | undefined> => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/spending-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch spending types");
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getSpendingTypeById = async (id: number) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/spending-types/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch spending type");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const createSpendingType = async (payload: Omit<ISpendingType, "id">) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/spending-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to create spending type");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const editSpendingType = async (editData: IEditSpendingTypePayload) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/spending-types/${editData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify(editData.payload),
    });
    if (!response.ok) {
      throw new Error("Failed to edit spending type");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const deleteSpendingType = async (id: number) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/spending-types/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete spending type");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

import env from "@/env";

export interface ISpendingPayment {
  id: string;
  date: string;
  description?: string | undefined | null;
  spending_type: {
    id: string;
    name: string;
    amount: string;
  };
}

export interface ISpendingPaymentPayload {
  spending_type_id: string;
  date: string;
  description?: string | undefined | null;
}

export interface ISpendingEditPayload {
  id: string;
  payload: ISpendingPaymentPayload;
}

export const getSpendingPayments = async (): Promise<ISpendingPayment[]> => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/spending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch spending payments");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const getSpendingPaymentById = async (
  id: number,
): Promise<ISpendingPayment | undefined> => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/spending/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch spending payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return;
  }
};

export const createSpendingPayment = async (payload: ISpendingPaymentPayload) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/spending`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create spending payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const editSpendingPayment = async (
  editPayload: ISpendingEditPayload,
) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${env.baseUrl}/spending/${editPayload.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
        },
        body: JSON.stringify(editPayload.payload),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to edit spending payment");
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteSpendingPayment = async (id: string) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/spending/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete spending payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

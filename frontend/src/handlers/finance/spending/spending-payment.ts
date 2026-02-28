import env from "@/env";

export interface ISpendingPayment {
  spending_type_id: number;
  date: string;
}

export const getSpendingPayments = async () => {
  const jwt = localStorage.getItem("jwt");
  try {
    const response = await fetch(`${env.baseUrl}/spending-payments`, {
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
  }
};

export const getSpendingPaymentById = async (id: number) => {
  const jwt = localStorage.getItem("jwt");
  try {
    const response = await fetch(`${env.baseUrl}/spending-payments/${id}`, {
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
  }
};

export const createSpendingPayment = async (payload: ISpendingPayment) => {
  const jwt = localStorage.getItem("jwt");
  try {
    const response = await fetch(`${env.baseUrl}/spending-payments`, {
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
  id: number,
  payload: ISpendingPayment,
) => {
  const jwt = localStorage.getItem("jwt");
  try {
    const response = await fetch(`${env.baseUrl}/spending-payments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to edit spending payment");
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteSpendingPayment = async (id: number) => {
  const jwt = localStorage.getItem("jwt");
  try {
    const response = await fetch(`${env.baseUrl}/spending-payments/${id}`, {
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

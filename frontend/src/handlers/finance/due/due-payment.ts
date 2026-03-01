import env from "@/env";

export interface IDuePayment {
  id: string;
  date: string;
  description?: string | null | undefined;
  due_type_id: string;
  due_type: {
    id: string;
    name: string;
    amount: string;
  };
  resident: {
    id: string;
    name: string;
  };
}

export interface IDuePaymentPayload {
  resident_id: string;
  due_type_id: string;
  date: string;
  description?: string | null | undefined;
  month_amount: string;
}

export interface IDueEditPayload {
  id: string;
  payload: Omit<IDuePayment, "month_amount" | "due_type" | "resident" | "id">;
}

export const getDuePayments = async (): Promise<IDuePayment[]> => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/due-payment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch due payments");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const getDuePaymentById = async (
  id: number,
): Promise<IDuePayment | undefined> => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/due-payment/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch due payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return;
  }
};

export const createDuePayment = async (payload: IDuePaymentPayload) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/due-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create due payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const editDuePayment = async (editPayload: IDueEditPayload) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${env.baseUrl}/due-payment/${editPayload.id}`,
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
      throw new Error("Failed to edit due payment");
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteDuePayment = async (id: string) => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/due-payment/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete due payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

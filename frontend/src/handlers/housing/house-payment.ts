import env from "@/env";

export interface IHousePayment {
  id: number;
  payment_date: string;
  payment_amount: number;
  payment_status: string;
  description?: string;
  occupant_history?: {
    house?: {
      id: number;
      number: number;
    };
    resident: {
      id: number;
      name: string;
    };
  };
}

export interface IHousePaymentPayload {
  resident_id?: string;
  payment_date?: string;
  payment_amount?: string;
  payment_status?: boolean | string;
  description?: string;
  month_amount: string;
}

export interface IHousePaymentEditPayload {
  id: number;
  payload: Omit<IHousePaymentPayload, "month_amount" | "resident_id">;
}

export const getHousePayment = async (): Promise<IHousePayment[]> => {
  try {
    const jwt = localStorage.getItem("authToken");

    const response = await fetch(`${env.baseUrl}/house-payment`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("failed to fetch house payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getHousePaymentById = async (
  id: number,
): Promise<IHousePayment | undefined> => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/house-payment/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch house payment by id ${id}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return;
  }
};

export const createHousePayment = async (payload: IHousePaymentPayload) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/house-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ ...payload }),
    });

    if (!response.ok) {
      throw new Error("Failed to create house payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const editHousePayment = async (
  editPayload: IHousePaymentEditPayload,
) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${env.baseUrl}/house-payment/${editPayload.id}`,
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
      throw new Error("Failed to update house payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const deleteHousePayment = async (id: number) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/house-payment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete house payment");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

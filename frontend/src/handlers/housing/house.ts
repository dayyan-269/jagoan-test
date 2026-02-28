import env from "@/env";

export interface IHouse {
  id?: number;
  number?: string;
  recent_occupant?: string;
}

export interface IEditHousePayload {
  id: number;
  payload: Omit<IHouse, "id" | "recent_occupant">;
}

export interface IAssignPayload {
  id: number;
  payload: {
    resident_id: number;
    amount: number;
    description?: string;
    date: string;
  };
}

export interface IEndContractPayload {
  id: number;
  payload: { end_date: string };
}

export const getHouses = async (): Promise<IHouse[]> => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/houses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch houses");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const getHouseById = async (id: number): Promise<IHouse | null> => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/houses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch house");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getHouseHistory = async (id?: number) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${env.baseUrl}/occupant-history?houseId=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch house");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const createHouse = async (
  payload: Omit<IHouse, "id" | "recent_occupant">,
) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/houses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ ...payload, status: "aktif" }),
    });

    if (!response.ok) {
      throw new Error("Failed to create house");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// TODO: make an endpoint to assign resident to house

export const assignHouse = async (assignPayload: IAssignPayload) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${env.baseUrl}/occupant-history/${assignPayload.id}/assign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
        },
        body: JSON.stringify(assignPayload.payload),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to assign house");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// TODO: make an endpoint to end resident housing contract

export const endContract = async (endContractPayload: IEndContractPayload) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${env.baseUrl}/occupant-history/${endContractPayload.id}/end`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
        },
        body: JSON.stringify(endContractPayload.payload),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to assign house");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const editHouse = async (editPayload: IEditHousePayload) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/houses/${editPayload.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
      body: JSON.stringify(editPayload.payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update house");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const deleteHouse = async (id: number) => {
  const jwt = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${env.baseUrl}/houses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete house");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

import env from "@/env";
import type IErrorResponse from "@/types/errors";

export interface IMonthlyStats {
  earning_total: number;
  monthly_spending: number;
  saldo_total: number;
  monthly_stats: [
    {
      earnings: {
        month: string;
        total_pendapatan: number;
      };
      spendings: {
        month: string;
        total_pengeluaran: number;
      };
    },
  ];
}

interface IEarningReport {
  earning: {
    payment_amount: number;
    payment_date: string;
    description: string;
    resident_name: string;
    payment_type: string;
  };
}

interface ISpendingReport {
  spending: {
    id: number;
    payment_amount: number;
    date: string;
    spending_type: {
      name: string;
      amount: number;
    };
  };
}

interface IFilterPayload {
  start_date?: string;
  end_date?: string;
}

export interface IFinancialReport {
  spendings: {
    spending_total: number;
    spending: ISpendingReport[];
  };
  earnings: {
    earning_total: number;
    earning: IEarningReport[];
  };
}

export const getMonthlyStats = async () => {
  const jwt = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${env.baseUrl}/stats/monthly`, {
      headers: {
        method: "GET",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to fetch monthly stats",
      data: error,
    };
  }
};

export const getFinancialReport = async (
  payload?: IFilterPayload,
): Promise<IFinancialReport | IErrorResponse> => {
  const jwt = localStorage.getItem("authToken");
  try {
    const responseSpending = await fetch(
      `${env.baseUrl}/stats/monthly/spending?start_date=${payload?.start_date}&end_date=${payload?.end_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    const responseEarning = await fetch(
      `${env.baseUrl}/stats/monthly/earning?start_date=${payload?.start_date}&end_date=${payload?.end_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    if (!responseSpending.ok || !responseEarning.ok) {
      throw new Error(
        `HTTP error: ${responseSpending.status} or ${responseEarning.status}`,
      );
    }

    const { data: spendingData } = await responseSpending.json();
    const { data: earningData } = await responseEarning.json();

    const finalData = {
      spendings: {
        spending: spendingData.spending,
        spending_total: spendingData.spending_total,
      },
      earnings: {
        earning: earningData.earning,
        earning_total: earningData.earning_total,
      },
    };
    console.log(finalData);

    return finalData;
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to fetch financial report",
      data: error,
    };
  }
};

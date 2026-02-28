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

export interface IFinancialReport {
  spendings: ISpendingReport[];
  earnings: IEarningReport[];
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
    return {
      message: "Failed to fetch monthly stats",
      data: error,
    };
  }
};

export const getFinancialReport = async (): Promise<
  IFinancialReport | IErrorResponse
> => {
  const jwt = localStorage.getItem("authToken");
  try {
    const responseSpending = await fetch(
      `${env.baseUrl}/stats/monthly/spending`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    const responseEarning = await fetch(
      `${env.baseUrl}/stats/monthly/earning`,
      {
        headers: {
          method: "GET",
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

    return { spendings: spendingData, earnings: earningData };
  } catch (error) {
    return {
      message: "Failed to fetch financial report",
      data: error,
    };
  }
};

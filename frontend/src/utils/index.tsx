import env from "@/env";

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  const reformattedDate = new Date(date);

  const formatted = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(reformattedDate);

  return formatted;
};

export const formatImg = (rawUrl: string): string => {
  const url = new URL(env.baseUrl);
  return `${url.origin}${rawUrl}`;
};

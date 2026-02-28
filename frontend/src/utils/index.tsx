export const sumArray = (array, key) => {
  return array.reduce((accumulator, currentItem) => {
    return accumulator + Number(currentItem[key] || 0);
  }, 0); 
};

export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
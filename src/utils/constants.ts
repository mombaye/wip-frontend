export const MONTHS = [
  { label: "Jan", value: "Jan" }, { label: "Feb", value: "Feb" }, { label: "Mar", value: "Mar" },
  { label: "Apr", value: "Apr" }, { label: "May", value: "May" }, { label: "Jun", value: "Jun" },
  { label: "Jul", value: "Jul" }, { label: "Aug", value: "Aug" }, { label: "Sep", value: "Sep" },
  { label: "Oct", value: "Oct" }, { label: "Nov", value: "Nov" }, { label: "Dec", value: "Dec" },
];
const startYear = 2018;
const endYear = new Date().getFullYear() + 1;
export const YEARS = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => {
    const y = (startYear + i).toString().slice(-2);
    return { label: `${y}`, value: y };
  }
);

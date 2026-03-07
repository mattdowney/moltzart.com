function parseDateInput(input: string): Date | null {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(input) ? `${input}T12:00:00` : input;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatShortDate(input: string | null | undefined): string {
  if (!input) return "None set";
  const date = parseDateInput(input);
  if (!date) return input;

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}-${day}-${year}`;
}

export function formatShortDateTime(input: string | null | undefined): string {
  if (!input) return "None set";
  const date = parseDateInput(input);
  if (!date) return input;

  const base = formatShortDate(input);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${base} ${hour12}:${minutes}${meridiem}`;
}

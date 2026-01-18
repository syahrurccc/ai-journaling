import type { Journal } from "./interfaces";

export function throwErr(msg: string, code: number): never {
  const err = new Error(msg);
  (err as any).status = code;
  throw err;
}

export function toUtcDateOnly(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

export function isMoreThanAWeekApart(a: Date, b: Date): boolean {
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  return Math.abs(a.getTime() - b.getTime()) > WEEK_MS;
}

export function formatEntries(entries: Journal[]) {
  return entries
    .map((entry, index) => {
      return `
Entry ${index + 1}
Date: ${entry.createdAt.toISOString().slice(0, 10)}
Text:
${entry.content}
`.trim();
    })
    .join("\n\n");
}

export function validateDates(d1?: string, d2?: string){
  const today = toUtcDateOnly(new Date());
  
  if (!d1) throwErr("Starting date needs to be defined", 400);
  const from = new Date(d1);
  
  if (from > today) {
    throwErr("Can't be from the future", 400);
  }
  
  if (d1 && d2) {
    const to = new Date(d2);
    if (from > to) {
      throwErr("Invalid date intervals", 400);
    } else if (isMoreThanAWeekApart(from, to)) {
      throwErr("Date intervals can't be more than a week", 400);
    }
  }
}

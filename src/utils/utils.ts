import { InvalidDateRangeError } from "../errors/domain";
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
  
  if (!d1) throw new InvalidDateRangeError();
  const from = new Date(d1);
  
  if (from > today) throw new InvalidDateRangeError();
  
  if (d1 && d2) {
    const to = new Date(d2);
    if (from > to) {
      throw new InvalidDateRangeError();
    } else if (isMoreThanAWeekApart(from, to)) {
      throw new InvalidDateRangeError();
    }
  }
}

export function throwErr(msg: string, code: number): never {
  const err = new Error(msg);
  (err as any).status = code;
  throw err;
}

export function toUtcDateOnly(d: Date): Date {
  return new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  ));
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function isMoreThanAWeekApart(a: Date, b: Date): boolean {
  return Math.abs(a.getTime() - b.getTime()) > WEEK_MS;
}

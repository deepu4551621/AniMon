export const DAYS_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function extractDay(item: any): string {
  const days = DAYS_ORDER;
  const candidates = [item.broadcast?.string, item.aired?.string, item.broadcast, item.aired?.from, item.aired?.to];
  for (const v of candidates) {
    if (!v) continue;
    const s = String(v);
    for (const d of days) {
      const re = new RegExp(d, 'i');
      if (re.test(s)) return d;
    }
    for (const d of days) {
      const re = new RegExp(d + 's', 'i');
      if (re.test(s)) return d;
    }
  }
  return 'Other';
}

export function groupByDay(items: any[]) {
  const map = new Map<string, any[]>();
  for (const d of DAYS_ORDER.concat(['Other'])) map.set(d, []);
  items.forEach(it => {
    const day = extractDay(it) || 'Other';
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(it);
  });
  return map;
}

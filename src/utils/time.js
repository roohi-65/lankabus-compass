import { useEffect, useState } from 'react';

export const toMin = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const pad = (n) => String(n).padStart(2, '0');

// 14:05 -> "2:05 PM". Values past midnight wrap around.
export const fmtClock = (min) => {
  const m = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m % 60)} ${suffix}`;
};

export const fmtDuration = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

export const nowMin = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

// Re-renders every 30s so "next bus" labels stay fresh.
export function useNow() {
  const [now, setNow] = useState(nowMin());
  useEffect(() => {
    const id = setInterval(() => setNow(nowMin()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// Minutes after the origin departure that the bus reaches stop #index.
// The dataset stores origin departures only, so intermediate times are estimated
// by spreading the total journey time evenly across the stops.
// Buses also run the opposite way on the same timetable (reverse = true).
export const stopOffset = (route, index, reverse = false) => {
  const n = route.stops.length;
  if (n < 2) return 0;
  const pos = reverse ? n - 1 - index : index;
  return Math.round((route.durationMin * pos) / (n - 1));
};

// Next `count` times a bus of this route calls at stop #index (today, then tomorrow).
export function nextTimesAtStop(route, index, now, count = 3, reverse = false) {
  const offset = stopOffset(route, index, reverse);
  const today = route.departures.map((d) => toMin(d) + offset);
  const all = [...today, ...today.map((t) => t + 1440)].sort((a, b) => a - b);
  return all.filter((t) => t >= now).slice(0, count);
}

// "in 12 min", "3:40 PM", or "tomorrow 5:10 AM"
export function whenLabel(min, now) {
  const diff = min - now;
  if (diff < 1) return 'now';
  if (diff < 60) return `in ${diff} min`;
  return min >= 1440 ? `tomorrow ${fmtClock(min)}` : fmtClock(min);
}

// Share of the route's fare/time for a partial ride between two stop indexes (either direction).
export const legShare = (route, from, to) =>
  Math.abs(to - from) / Math.max(1, route.stops.length - 1);
export const legDuration = (route, from, to) =>
  Math.round(route.durationMin * legShare(route, from, to));
export const legFare = (route, from, to) =>
  Math.max(30, Math.round((route.fare * legShare(route, from, to)) / 10) * 10);

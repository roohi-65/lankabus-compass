import { routes, stops, stopsById, routesByStop } from '../data';

const norm = (s) => s.toLowerCase().trim();

export const matchStop = (stop, q) => {
  const query = norm(q);
  if (!query) return true;
  return (
    norm(stop.name).includes(query) ||
    norm(stop.district).includes(query) ||
    norm(stop.province).includes(query)
  );
};

export const matchRoute = (route, q) => {
  const query = norm(q);
  if (!query) return true;
  if (norm(route.number) === query || norm(route.name).includes(query)) return true;
  return route.stops.some((id) => norm(stopsById[id].name).includes(query));
};

export function findTrips(fromId, toId) {
  const direct = [];
  (routesByStop[fromId] || []).forEach(({ route, index }) => {
    const j = route.stops.indexOf(toId);
    if (j !== -1 && j !== index) direct.push({ route, from: index, to: j });
  });
  direct.sort(
    (a, b) => Math.abs(a.to - a.from) - Math.abs(b.to - b.from) || a.route.fare - b.route.fare
  );
  const directIds = new Set(direct.map((d) => d.route.id));

  const best = {};
  (routesByStop[fromId] || []).forEach(({ route: A, index: i }) => {
    A.stops.forEach((viaId, k) => {
      if (k === i || viaId === toId) return;
      (routesByStop[viaId] || []).forEach(({ route: B, index: m }) => {
        if (B.id === A.id || directIds.has(B.id)) return;
        const q = B.stops.indexOf(toId);
        if (q === -1 || q === m) return;
        const total = Math.abs(k - i) + Math.abs(q - m);
        const key = `${A.id}>${B.id}`;
        if (!best[key] || total < best[key].total) {
          best[key] = {
            viaIds: [viaId],
            total,
            legs: [
              { route: A, from: i, to: k },
              { route: B, from: m, to: q },
            ],
          };
        }
      });
    });
  });
  const transfers = Object.values(best)
    .sort((a, b) => a.total - b.total)
    .slice(0, 6);

  let twoChanges = [];
  if (direct.length === 0 && transfers.length === 0) {
    const found = {};
    (routesByStop[fromId] || []).forEach(({ route: A, index: i }) => {
      A.stops.forEach((v1, k) => {
        if (k === i) return;
        (routesByStop[v1] || []).forEach(({ route: B, index: m }) => {
          if (B.id === A.id) return;
          B.stops.forEach((v2, n) => {
            if (n === m || v2 === v1) return;
            (routesByStop[v2] || []).forEach(({ route: C, index: o }) => {
              if (C.id === A.id || C.id === B.id) return;
              const q = C.stops.indexOf(toId);
              if (q === -1 || q === o) return;
              const total = Math.abs(k - i) + Math.abs(n - m) + Math.abs(q - o);
              const key = `${A.id}>${B.id}>${C.id}`;
              if (!found[key] || total < found[key].total) {
                found[key] = {
                  viaIds: [v1, v2],
                  total,
                  legs: [
                    { route: A, from: i, to: k },
                    { route: B, from: m, to: n },
                    { route: C, from: o, to: q },
                  ],
                };
              }
            });
          });
        });
      });
    });
    twoChanges = Object.values(found)
      .sort((a, b) => a.total - b.total)
      .slice(0, 5);
  }
  return { direct, transfers, twoChanges };
}

export function searchAll(q, limit = 6) {
  return {
    routes: routes.filter((r) => matchRoute(r, q)).slice(0, limit),
    stops: stops.filter((s) => matchStop(s, q)).slice(0, limit),
  };
}

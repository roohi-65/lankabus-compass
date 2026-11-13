import stopsData from './stops.json';
import routesData from './routes.json';

export const stops = stopsData;
export const routes = routesData;

export const stopsById = Object.fromEntries(stops.map((s) => [s.id, s]));
export const routesById = Object.fromEntries(routes.map((r) => [r.id, r]));

export const routesByStop = {};
routes.forEach((route) => {
  route.stops.forEach((stopId, index) => {
    (routesByStop[stopId] = routesByStop[stopId] || []).push({ route, index });
  });
});

export const provinces = [...new Set(stops.map((s) => s.province))].sort();
export const routeTypes = ['Normal', 'Semi-Luxury', 'Luxury (AC)', 'Expressway'];
export const districtCount = new Set(stops.map((s) => s.district)).size;

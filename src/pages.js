const modules = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
export const pages = Object.fromEntries(Object.entries(modules).map(([path, mod]) => [
  path.replace('/src/routes', '').replace('/+page.svx', ''), mod
]));
export function pageAt(path) {
  const route = path.replace(/\/$/, '') || '/kb';
  const mod = pages[route];
  if (!mod) throw new Error('No KB page at ' + route);
  return mod.default;
}

import { render } from 'svelte/server';
import App from './App.svelte';
import { pages, pageAt } from './pages.js';
export const routes = Object.keys(pages).sort();
export function renderRoute(path) {
  return render(App, { props: { page: pageAt(path) } });
}

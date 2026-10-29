import { hydrate } from 'svelte';
import App from './App.svelte';
import { pageAt } from './pages.js';
hydrate(App, { target: document.getElementById('app'), props: { page: pageAt(location.pathname) } });

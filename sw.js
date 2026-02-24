/**
 * TouchTab – Service Worker
 *
 * Caching strategy:
 *  • App shell (HTML, manifest, icons) → Cache-first with background update.
 *    The page is always served instantly from cache; a fresh copy is fetched
 *    and stored so the next load is up-to-date.
 *  • CDN resources (Tailwind, Lucide, Google Fonts) → Stale-while-revalidate.
 *    Cached on first fetch, served from cache on subsequent visits while a
 *    background fetch refreshes the entry.
 *  • Everything else → Network-only (pass through).
 *
 * Update flow: increment CACHE_VERSION to bust all caches on next SW install.
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME    = `touchtab-${CACHE_VERSION}`;

/** Resources we pre-cache during install (app shell). */
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon.svg',
];

/** CDN origins we cache on first use (stale-while-revalidate). */
const CDN_ORIGINS = [
    'https://cdn.tailwindcss.com',
    'https://unpkg.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            // addAll() fails silently per-request on network errors during install
            // so we add individually and swallow individual failures.
            Promise.allSettled(APP_SHELL.map((url) => cache.add(url)))
        )
    );
    // Activate immediately – don't wait for old tabs to close.
    self.skipWaiting();
});

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        // Delete all caches that are NOT the current version.
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            )
        )
    );
    // Take control of all existing clients immediately.
    self.clients.claim();
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    // Only handle GET requests.
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // ── App origin: cache-first + background update ─────────────────────────
    if (url.origin === self.location.origin) {
        event.respondWith(cacheFirstWithUpdate(event.request));
        return;
    }

    // ── CDN origins: stale-while-revalidate ──────────────────────────────────
    if (CDN_ORIGINS.some((o) => url.href.startsWith(o))) {
        event.respondWith(staleWhileRevalidate(event.request));
        return;
    }

    // Everything else: let it pass through to the network.
});

// ─── Strategy helpers ────────────────────────────────────────────────────────

/**
 * Cache-first: serve cached response instantly if available, then fetch a
 * fresh copy and store it for the next visit.  Falls back to network when
 * nothing is cached.
 */
async function cacheFirstWithUpdate(request) {
    const cache  = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    // Fetch a fresh copy in the background regardless.
    const networkFetch = fetch(request)
        .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
        })
        .catch(() => null);

    return cached ?? (await networkFetch) ?? new Response('Offline', { status: 503 });
}

/**
 * Stale-while-revalidate: serve from cache instantly (if available) while
 * fetching a fresh copy in the background for the next request.
 */
async function staleWhileRevalidate(request) {
    const cache  = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    // Always kick off a background update.
    const networkFetch = fetch(request)
        .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
        })
        .catch(() => null);

    // Return cached immediately if we have it; otherwise wait for network.
    return cached ?? (await networkFetch) ?? new Response('', { status: 503 });
}

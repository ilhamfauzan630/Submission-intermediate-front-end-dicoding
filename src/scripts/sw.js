import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import CONFIG from './config';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({
        url
    }) => {
        return url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome');
    },
    new CacheFirst({
        cacheName: 'fontawesome',
    }),
);

registerRoute(
    ({
        url
    }) => {
        return url.origin === 'https://ui-avatars.com';
    },
    new CacheFirst({
        cacheName: 'avatars-api',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

registerRoute(
    ({
        request,
        url
    }) => {
        const baseUrl = new URL(CONFIG.BASE_URL);
        return baseUrl.origin === url.origin && request.destination !== 'image';
    },
    new NetworkFirst({
        cacheName: 'story-api',
    }),
);

registerRoute(
    ({
        request,
        url
    }) => {
        const baseUrl = new URL(CONFIG.BASE_URL);
        return baseUrl.origin === url.origin && request.destination === 'image';
    },
    new StaleWhileRevalidate({
        cacheName: 'story-api-images',
    }),
);

registerRoute(
    ({
        url
    }) => {
        return url.origin.includes('maptiler');
    },
    new CacheFirst({
        cacheName: 'maptiler-api',
    }),
);

self.addEventListener('push', (event) => {
    console.log('Service worker pushing...');

    async function chainPromise() {
        await self.registration.showNotification('Story App - Notifikasi Baru!', {
            body: 'Ada cerita baru yang menantimu. Yuk, cek sekarang!',
        });
    }

    event.waitUntil(chainPromise());
});
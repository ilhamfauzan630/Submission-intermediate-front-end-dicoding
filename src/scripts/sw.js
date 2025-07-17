self.addEventListener('push', (event) => {
    console.log('Service worker pushing...');

    async function chainPromise() {
        await self.registration.showNotification('Story App - Notifikasi Baru!', {
            body: 'Ada cerita baru yang menantimu. Yuk, cek sekarang!',
        });
    }

    event.waitUntil(chainPromise());
});
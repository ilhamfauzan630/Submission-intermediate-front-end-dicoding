import { showFormattedDate } from './utils'; 

export function generateUnauthenticatedNavigationListTemplate() {
    return `
        <li id="push-notification-tools" class="push-notification-tools"></li>
        <li><a href="#/login">Login</a></li>
        <li><a href="#/register">Register</a></li>
    `;
}

export function generateAuthenticatedNavigationListTemplate() {
    return `
        <li><a href="#/">Beranda</a></li>
        <li><a href="#/about">About</a></li>
        <li><a href="#/bookmark">Bookmark</a></li>
        <li><a href="#/add-story"><i class="fas fa-plus"></i> Add Story</a></li>
        <li id="push-notification-tools" class="push-notification-tools"></li>
        <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
    `;
}

export function generateLoaderAbsoluteTemplate() {
    return `
        <div class="loader loader-absolute"></div>`
}

export function generateStoryItemTemplate({
    id,
    name,
    description,
    photoUrl,
    createdAt,
    lat,
    lon,
}) {
    return `
        <div tabindex="0" class="story-item" data-storyid="${id}">
            <div class="story-item__header">
                <h2 id="story-title" class="story-item__title">${name}</h2>
                <div class="story-item__createdat">
                    <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
                </div>
            </div>
            <div class="story-item__body">
                <div id="story-description" class="story-item__description">
                    ${description}
                </div>
                <a class="story-item__read-more" href="#/stories/${id}">
                    <img class="story-item__image" src="${photoUrl}" alt="${name}">
                </a>
            </div>
        </div>
    `;
}

export function generateStoryListEmptyTemplate() {
    return `
        <div id="story-list-empty" class="story-list__empty">
            <h2>Tidak ada post yang tersedia</h2>
        </div>`;
}

export function generateStoryListErrorTemplate(message) {
    return `
        <div id="story-list-error" class="story-list__error">
            <h2>Terjadi kesalahan</h2>
            <p>${message}</p>
        </div>
    `;
}

export function generateStoryDetailImageTemplate(photoUrl, alt = '') {
    if (!photoUrl) {
        return `
            <img class="story-detail__image" src="/images/logo.png" alt="No image available">
        `;
    }

    return `
        <img class="story-detail__image" src="${photoUrl}" alt="${alt}" width="800px">
    `;
}

export function generateStoryDetailTemplate({
    name,
    description,
    photoUrl,
    createdAt,
    lat,
    lon,
    placeName,
}) {
    const hasCoordinates = lat && lon;

    return `
        <div class="story-detail__header">
            <div class="story-detail__title-container"> 
                <h1 class="story-detail__title">${name}</h1>
                <div id="save-actions-container"></div>
            </div>
            ${generateStoryDetailImageTemplate(photoUrl, name)}
        </div>

        <div class="story-detail__body">
            <p class="story-detail__description">${description}</p>
            <div class="story-detail__createdat">
                <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
            </div>
        </div>

        <div class="story-detail__place-name" style="${hasCoordinates ? '' : 'display: none;'}">
            ${placeName ? `<p class="story-detail__place-name-text"><h2 class="location__title">Lokasi: ${placeName}</h2></p>` : ''}
        </div>

        <div class="story-detail__location">
            ${hasCoordinates ? `<p class="story-detail__coordinates">Koordinat: ${lat}, ${lon}</p>` : ''}
        </div>

        ${
            hasCoordinates
                ? `
                    <div class="location-map__container">
                        <div id="map" class="location-map"></div>
                        <div id="map-loading-container"></div>
                    </div>
                `
                : `
                    <div class="location-map__not-available">
                        <p>Lokasi tidak tersedia.</p>
                    </div>
                `
        }
    `;
}

export function generateSubscribeButtonTemplate() {
    return `
        <button id="subscribe-button" class="btn subscribe-button">
            Subscribe <i class="fas fa-bell"></i>
        </button>
    `;
}

export function generateUnsubscribeButtonTemplate() {
    return `
        <button id="unsubscribe-button" class="btn unsubscribe-button">
            Unsubscribe <i class="fas fa-bell-slash"></i>
        </button>
    `;
}

export function generateSaveStoryButtonTemplate() {
    return `
        <button id="story-detail-save" class="btn btn-transparent">
            Add Bookmark <i class="far fa-bookmark"></i>
        </button>
    `;
}

export function generateRemoveStoryButtonTemplate() {
    return `
        <button id="story-detail-remove" class="btn btn-transparent">
            Remove Bookmark <i class="fas fa-bookmark"></i>
        </button>
    `;
}
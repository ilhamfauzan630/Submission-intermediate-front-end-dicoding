import { generateLoaderAbsoluteTemplate, generateStoryDetailTemplate, generateSaveStoryButtonTemplate, generateRemoveStoryButtonTemplate } from "../../../templates";
import StoryDetailPresenter from "./story-detail-presenter";
import * as StoryAPI from "../../../data/api";
import { parseActivePathname } from "../../../routes/url-parser";
import Map from "../../../utils/map";
import Database from '../../../data/database';

export default class StoryDetailPage {
    #presenter = null;
    #map = null;

    async render() {
        return `
            <section class="container">
                <div class="story-detail">
                    <div id="story-detail-loading-container"></div>
                    <div id="story-detail"></div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
            view: this,
            apiModel: StoryAPI,
            dbModel: Database,
        });

        this.#presenter.showStoryDetail();
    }

    async populateStoryDetail(message, story) {
        document.getElementById("story-detail").innerHTML = generateStoryDetailTemplate({
            name: story.name,
            description: story.description,
            photoUrl: story.photoUrl,
            createdAt: story.createdAt,
            lat: story.lat,
            lon: story.lon,
            placeName: story.placeName,
        });

        
        const hasValidCoordinates = story.lat != null && story.lon != null && story.lat !== '' && story.lon !== '';
        
        if (hasValidCoordinates) {
            await this.#presenter.showStoryDetailMap();

            if (this.#map) {
                const reportCoordinate = [story.lat, story.lon];
                const markerOptions = {
                    alt: story.description
                };
                const popupOptions = {
                    content: story.description
                };

                this.#map.changeCamera(reportCoordinate);
                this.#map.addMarker(reportCoordinate, markerOptions, popupOptions);
            }
        }

        this.#presenter.showSaveButton();
    }

    async initialMap() {
        this.#map = await Map.build('#map', {
            zoom: 15,
        });
    }

    populateStoryDetailError(message) {
        document.getElementById("story-detail").innerHTML = `
            <div class="story-detail__error">
                <h2>Terjadi kesalahan</h2>
                <p>${message}</p>
            </div>
        `;
    }

    renderSaveButton() {
        document.getElementById('save-actions-container').innerHTML =
            generateSaveStoryButtonTemplate();

        document.getElementById('story-detail-save').addEventListener('click', async () => {
            await this.#presenter.saveStory();

            await this.#presenter.showSaveButton();
        });
    }

    renderRemoveButton() {
        document.getElementById('save-actions-container').innerHTML =
            generateRemoveStoryButtonTemplate();

        document.getElementById('story-detail-remove').addEventListener('click', async () => {
            await this.#presenter.removeStory();
            await this.#presenter.showSaveButton();
        });
    }

    saveToBookmarkSuccessfully(message) {
        console.log(message);
    }
    saveToBookmarkFailed(message) {
        alert(message);
    }

    removeFromBookmarkSuccessfully(message) {
        console.log(message);
    }
    removeFromBookmarkFailed(message) {
        alert(message);
    }

    showLoading() {
        document.getElementById("story-detail-loading-container").innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideLoading() {
        document.getElementById("story-detail-loading-container").innerHTML = "";
    }

    showMapLoading() {
        document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideMapLoading() {
        document.getElementById('map-loading-container').innerHTML = '';
    }

}
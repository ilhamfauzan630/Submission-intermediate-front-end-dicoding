import { generateLoaderAbsoluteTemplate, generateStoryDetailTemplate } from "../../../templates";
import StoryDetailPresenter from "./story-detail-presenter";
import * as StoryAPI from "../../../data/api";
import { parseActivePathname } from "../../../routes/url-parser";
import Map from "../../../utils/map";

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
            model: StoryAPI,
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

        await this.#presenter.showStoryDetailMap();

        if (this.#map) {
            const reportCoordinate = [story.lat, story.lon];
            const markerOptions = { alt: story.description };
            const popupOptions = { content: story.description };
            
            this.#map.changeCamera(reportCoordinate);
            this.#map.addMarker(reportCoordinate, markerOptions, popupOptions);
        }
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
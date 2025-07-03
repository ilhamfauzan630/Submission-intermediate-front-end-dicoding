import { generateLoaderAbsoluteTemplate, generateStoryDetailTemplate } from "../../../template";
import StoryDetailPresenter from "./story-detail-presenter";
import * as StoryAPI from "../../../data/api";
import { parseActivePathname } from "../../../routes/url-parser";

export default class StoryDetailPage {
    #presenter = null;

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
}
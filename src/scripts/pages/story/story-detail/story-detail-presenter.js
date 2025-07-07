import { storyMapper } from '../../../data/api-mapper';

export default class StoryDetailPresenter {
    #storyId;
    #view;
    #model;

    constructor(storyId, { view, model }) {
        this.#storyId = storyId;
        this.#view = view;
        this.#model = model;
    }

    async showStoryDetailMap() {
        this.#view.showMapLoading();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('ShowNewFormMap: error:', error);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async showStoryDetail() {
        this.#view.showLoading();
        try {
            const response = await this.#model.getStoryById(this.#storyId);

            if (!response.ok) {
                console.error('showStoryDetail: error:', response);
                this.#view.populateStoryDetailError(response.message);
                return;
            }

            const story = await storyMapper(response.story);
            console.log(story);

            this.#view.populateStoryDetail(response.message, story);
        } catch (error) {
            console.error('showStoryDetail: error:', error);
            this.#view.populateStoryDetailError(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}
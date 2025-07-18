import { storyMapper } from '../../../data/api-mapper';

export default class StoryDetailPresenter {
    #storyId;
    #view;
    #apiModel;
    #dbModel;

    constructor(storyId, { view, apiModel, dbModel }) {
        this.#storyId = storyId;
        this.#view = view;
        this.#apiModel = apiModel;
        this.#dbModel = dbModel;
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
            const response = await this.#apiModel.getStoryById(this.#storyId);

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

    async saveStory() {
        try {
            const response = await this.#apiModel.getStoryById(this.#storyId);
            const story = response.story;
            await this.#dbModel.putStory(story);
            this.#view.saveToBookmarkSuccessfully('Success to save to bookmark');
        } catch (error) {
            console.error('saveStory: error:', error);
            this.#view.saveToBookmarkFailed(error.message);
        }
    }

    async removeStory() {
        try {
            await this.#dbModel.removeStory(this.#storyId);
            this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
        } catch (error) {
            console.error('removeReport: error:', error);
            this.#view.removeFromBookmarkFailed(error.message);
        }
    }

    async showSaveButton() {
        if (await this.#isStorySaved()) {
            this.#view.renderRemoveButton();
            return;
        }
        this.#view.renderSaveButton();
    }

    async #isStorySaved() {
        return !!(await this.#dbModel.getStoryById(this.#storyId));
    }
}
export default class StoryDetailPresenter {
    #storyId;
    #view;
    #model;

    constructor(storyId, { view, model }) {
        this.#storyId = storyId;
        this.#view = view;
        this.#model = model;
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
            this.#view.populateStoryDetail(response.message, response.story);
        } catch (error) {
            console.error('showStoryDetail: error:', error);
            this.#view.populateStoryDetailError(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}
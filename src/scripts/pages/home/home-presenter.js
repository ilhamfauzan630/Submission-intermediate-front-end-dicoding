export default class HomePresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async initialGalleryAndMap() {
        this.#view.showLoading();
        try {
            const response = await this.#model.getAllStories();

            if (!response.ok) {
                console.error('initialGalleryAndMap: error:', response);
                this.#view.populateStoryListError(response.message);
            }
            this.#view.populateStoryList(response.message, response.listStory);
        } catch (error) {
            console.error('initialGalleryAndMap: error:', error);
            this.#view.populateStoryListError(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}
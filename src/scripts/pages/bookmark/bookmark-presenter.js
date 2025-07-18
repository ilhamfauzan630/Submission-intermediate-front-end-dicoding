import { storyMapper } from '../../data/api-mapper';

export default class BookmarkPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async initialGalleryAndMap() {
        this.#view.showLoading();
        try {
            const stories = await this.#model.getAllStories();
            
            const message = 'Success to load bookmarked stories';
            this.#view.populateStoryList(message, stories);
        } catch (error) {
            console.error('initialGalleryAndMap: error:', error);
            this.#view.populateStoryListError(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}